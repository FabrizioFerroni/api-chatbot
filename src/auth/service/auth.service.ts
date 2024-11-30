import { UsersEntity } from '@/api/users/entity/users.entity';
import { configApp } from '@/config/app/config.app';
import { TransformDto } from '@/shared/utils';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponseDto } from '../dto/response/response-auth.dto';
import { TokenService } from '@/api/token/service/token.service';
import { MailService } from '@/core/services/mail.service';
import { UserService } from '@/api/users/service/user.service';
import { UserInterfaceRepository } from '@/api/users/repository/user.interface.repository';
import { AuthInterfaceRepository } from '../repository/auth.interface.repository';
import { AuthMessagesError } from '../error/error-messages';
import {
  hashPassword,
  validatePassword,
} from '@/shared/utils/functions/validate-passwords';
import { UserMessagesError } from '@/api/users/errors/error-messages';
import { UpdateTokenDto } from '@/api/token/dto/update-token.dto';
import { VerifyDto } from '../dto/verify.dto';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password';
import { PayloadDto } from '../dto/payload.dto';
import { RefreshtokenDto } from '../dto/refresh-token.dto';
import { UpdateUserDto } from '@/api/users/dto/update-user.dto';
import { UserMesages } from '@/api/users/messages/user.message';
import { CreateTokenDto } from '@/api/token/dto/create-token.dto';
import { CreateUserDto } from '@/api/users/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { GoogleResponse } from '../interfaces/google-response.interface';
import { LoginResponseAuth } from '../interfaces/login-response.interface';
import { generateRandomWord } from '@/shared/utils/functions/generateRandomWords';

@Injectable()
export class AuthService {
  private failedLoginAttempts = new Map<string, number>();
  private password_failures: number = configApp().max_pass_failures;
  private readonly logger = new Logger(AuthService.name, { timestamp: true });
  private bodyMail: Record<string, string> = {};

  constructor(
    private readonly authRepository: AuthInterfaceRepository,
    private readonly userRepository: UserInterfaceRepository,
    @Inject(TransformDto)
    private readonly transform: TransformDto<UsersEntity, AuthResponseDto>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly usuarioService: UserService,
  ) {}

  /**
   * Handles failed login attempts for a user.
   * Increments the failed login attempts count for the given email.
   * If the number of failed attempts reaches the maximum allowed failures,
   * the user's account is deactivated and a BadRequestException is thrown.
   *
   * @param email - The email of the user attempting to log in.
   * @param id - The unique identifier of the user.
   * @throws BadRequestException - If the user's account has been blocked due to too many failed login attempts.
   */
  async handleFailedLogin(email: string, id: string) {
    const attempts = this.failedLoginAttempts.get(email) || 0;
    this.failedLoginAttempts.set(email, attempts + 1);

    if (attempts + 1 >= this.password_failures) {
      await this.saveUser(id, false);

      this.handleSuccessfulLogin(email);
      throw new BadRequestException(AuthMessagesError.USER_BLOCKED);
    }
  }

  /**
   * Handles the successful login of a user by removing any failed login attempts from the cache.
   *
   * @param email - The email of the user who has successfully logged in.
   * @returns {void}
   *
   * @remarks
   * This function is called after a successful login attempt. It removes any failed login attempts
   * associated with the provided email from the cache. This ensures that subsequent failed login attempts
   * are not counted towards the maximum allowed failed attempts.
   */
  async handleSuccessfulLogin(email: string) {
    this.failedLoginAttempts.delete(email);
  }

  /**
   * Handles the user login process.
   *
   * @param dto - The LoginDto object containing the user's email and password.
   * @throws NotFoundException - If the user with the provided email does not exist or is not active.
   * @throws BadRequestException - If the provided password does not match the user's password.
   * @returns The transformed user record as an AuthResponseDto object.
   */
  async login(dto: LoginDto) {
    if (dto.email !== null) dto.email = dto.email.toLowerCase();

    const user = await this.authRepository.getUserByEmail(dto.email);

    if (!user || !user.active) {
      throw new NotFoundException(
        !user
          ? AuthMessagesError.USER_NOT_FOUND
          : AuthMessagesError.USER_IS_NOT_ACTIVE,
      );
    }

    // varify only if user is provider is local but not otherwise
    if (user.provider !== 'local') {
      throw new InternalServerErrorException(
        AuthMessagesError.USER_IS_NOT_LOCAL,
      );
    }

    const passwordIsValid = await validatePassword(dto.password, user.password);

    if (!passwordIsValid) {
      await this.handleFailedLogin(dto.email, user.id);
      throw new BadRequestException(
        AuthMessagesError.PASSWORD_OR_EMAIL_INVALID,
      );
    }

    await this.handleSuccessfulLogin(dto.email);

    return this.transform.transformDtoObject(user, AuthResponseDto);
  }

  /**
   * Creates a new user account in the database.
   *
   * @param dto - The CreateUserDto object containing the user's details.
   * @throws BadRequestException - If the email already exists in the database.
   * @throws InternalServerErrorException - If the email cannot be sent or the token cannot be saved.
   * @returns A string message indicating that the user account has been created.
   */
  async create(dto: CreateUserDto) {
    const { firstName, lastName, email, phone } = dto;

    const emailLW = email.toLowerCase();

    if (dto.password) dto.password = await hashPassword(dto.password);

    await this.validateEmailBD(email);

    const token_id = crypto.randomUUID();

    const payload: PayloadDto = {
      email,
      id: token_id,
      provider: 'local',
    };

    const token = this.tokenService.generateJWTToken(payload, false, '24h');

    this.bodyMail.email = email;
    this.bodyMail.nombre = firstName;
    this.bodyMail.lastname = lastName;
    this.bodyMail.url = `${configApp().appHost}/verificar/${token}`;
    this.bodyMail.subject =
      'Gracias por registrarte, por favor confirma tu correo electrónico';

    const responseMail = await this.mailService.sendMail(
      'register',
      this.bodyMail,
    );

    if (!responseMail.ok) {
      this.logger.warn(responseMail.message);
      throw new InternalServerErrorException(
        AuthMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    const tokenData: CreateTokenDto = {
      token: token.toString(),
      email,
      isUsed: false,
      token_id,
    };

    this.tokenService.saveToken(tokenData);

    const newUser = {
      firstName,
      lastName,
      email: emailLW,
      phone,
      password: dto.password,
      active: false,
    };

    const data: UsersEntity = plainToInstance(UsersEntity, newUser);

    const userNew = await this.userRepository.saveUser(data);

    if (!userNew) {
      throw new InternalServerErrorException(
        UserMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    return UserMesages.USER_CREATED;
  }

  /**
   * Validates a user's email and activates their account.
   *
   * @param dto - The VerifyDto object containing the user's email and token.
   * @throws BadRequestException - If the token is used or the email does not match the token's email.
   * @throws NotFoundException - If the user with the provided email does not exist.
   * @throws InternalServerErrorException - If the user's account cannot be updated.
   * @returns A string message indicating that the user's account has been validated.
   */
  async validateUser(dto: VerifyDto) {
    const { email, token } = dto;

    const verifyToken: Record<string, string> =
      this.tokenService.verifyTokenCatch(
        token,
        configApp().secret_jwt_register,
      );

    const userEmailToken = verifyToken['email'];
    const tokenIdJWT = verifyToken['id'];

    const tokenData = await this.tokenService.findByTokenId(tokenIdJWT);

    if (tokenData.isUsed) {
      throw new BadRequestException(AuthMessagesError.USER_TOKEN_USED);
    }

    if (userEmailToken !== email) {
      throw new BadRequestException(AuthMessagesError.USER_MAIL_DIFFERENT);
    }

    const updateTokenData: Partial<UpdateTokenDto> = {
      isUsed: true,
    };

    const tokenId = tokenData.id.toString();

    await this.tokenService.updateToken(tokenId, updateTokenData);

    const user = await this.authRepository.getUserByEmail(userEmailToken);

    if (!user) {
      throw new NotFoundException(UserMessagesError.USER_NOT_FOUND);
    }

    const editUser = {
      active: true,
    };

    const result = await this.userRepository.update(
      user.id,
      editUser as UsersEntity,
    );

    if (!result) {
      throw new BadRequestException(UserMessagesError.USER_ERROR);
    }

    this.bodyMail.email = email;
    this.bodyMail.nombre = user.firstName;
    this.bodyMail.lastname = user.lastName;
    this.bodyMail.url = `${configApp().appHost}/iniciarsesion`;
    this.bodyMail.subject = `${user.firstName}, gracias por activar tu cuenta`;

    const responseMail = await this.mailService.sendMail(
      'login',
      this.bodyMail,
    );

    if (!responseMail.ok) {
      this.logger.warn(responseMail.message);
      throw new InternalServerErrorException(
        AuthMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    return UserMesages.USER_VALIDATED;
  }

  /**
   * Handles the process of recovering a user's password by sending a reset link to the user's email.
   *
   * @param dto - The ForgotPasswordDto object containing the user's email.
   * @throws NotFoundException - If the user with the provided email does not exist.
   * @throws InternalServerErrorException - If the email cannot be sent or the token cannot be saved.
   * @returns A string message indicating that a password reset link has been sent to the user's email.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const { email } = dto;

    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(UserMessagesError.USER_NOT_FOUND);
    }

    const token_id = crypto.randomUUID();

    const payload: PayloadDto = {
      email,
      id: token_id,
    };

    const token = this.tokenService.generateJWTToken(payload, false, '1h');

    this.bodyMail.email = email;
    this.bodyMail.nombre = user.firstName;
    this.bodyMail.lastname = user.lastName;
    this.bodyMail.url = `${configApp().appHost}/change-password/${token}`;
    this.bodyMail.subject = `${user.firstName}, sigue los pasos para recuperar tu contraseña`;

    const responseMail = await this.mailService.sendMail(
      'forgot_password',
      this.bodyMail,
    );

    if (!responseMail.ok) {
      this.logger.warn(responseMail.message);
      throw new InternalServerErrorException(
        AuthMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    const tokenData: CreateTokenDto = {
      token: token.toString(),
      email,
      isUsed: false,
      token_id,
    };

    const tokenSaved = this.tokenService.saveToken(tokenData);

    if (!tokenSaved) {
      throw new InternalServerErrorException(
        AuthMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    return 'Se ha enviado un correo a su dirección para recuperar su contraseña.';
  }

  /**
   * Changes a user's password.
   *
   * @param dto - The ChangePasswordDto object containing the user's email, password, confirm password, and token.
   * @throws BadRequestException - If the token is used, the email does not match the token's email, or the password and confirm password do not match.
   * @throws NotFoundException - If the user with the provided email does not exist.
   * @throws InternalServerErrorException - If the user's password cannot be updated.
   * @returns A string message indicating that the password was changed successfully.
   */
  async changePassword(dto: ChangePasswordDto) {
    const { email, password, confirm_password, token } = dto;

    const verifyToken: Record<string, string> =
      this.tokenService.verifyTokenCatch(
        token,
        configApp().secret_jwt_register,
      );

    const userEmailToken = verifyToken['email'];

    const tokenIdJWT = verifyToken['id'];

    const tokenData = await this.tokenService.findByTokenId(tokenIdJWT);

    if (tokenData.isUsed) {
      throw new BadRequestException(AuthMessagesError.USER_TOKEN_USED);
    }

    if (userEmailToken !== email) {
      throw new BadRequestException(AuthMessagesError.USER_MAIL_DIFFERENT);
    }

    const updateTokenData: Partial<UpdateTokenDto> = {
      isUsed: true,
    };

    const tokenId = tokenData.id.toString();

    await this.tokenService.updateToken(tokenId, updateTokenData);

    const user = await this.authRepository.getUserByEmail(userEmailToken);

    if (!user) {
      throw new NotFoundException(UserMessagesError.USER_NOT_FOUND);
    }

    if (password !== confirm_password) {
      throw new BadRequestException(UserMessagesError.USER_PASSWORD_NOT_MATCH);
    }

    const editUser = {
      password: await hashPassword(password),
    };

    const result = await this.userRepository.updateUser(
      user.id,
      editUser as UsersEntity,
    );

    if (!result) {
      throw new InternalServerErrorException(UserMessagesError.USER_ERROR);
    }

    this.bodyMail.email = email;
    this.bodyMail.nombre = user.firstName;
    this.bodyMail.lastname = user.lastName;
    this.bodyMail.url = `${configApp().appHost}/iniciarsesion`;
    this.bodyMail.subject = `${user.firstName}, has cambiado con éxito la contraseña`;

    const responseMail = await this.mailService.sendMail(
      'recovery',
      this.bodyMail,
    );

    if (!responseMail.ok) {
      this.logger.warn(responseMail.message);
      throw new InternalServerErrorException(
        AuthMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    return 'Se cambio la contraseña correctamente.';
  }

  /**
   * Refreshes an access token using a refresh token.
   *
   * @param token - The refresh token to be used for token refresh.
   * @throws UnauthorizedException - If the provided refresh token is invalid.
   * @returns A new access token if the refresh token is valid.
   */
  async refresh({ token }: RefreshtokenDto) {
    const tokenOld = this.tokenService.verifyTokenCatch(
      token,
      configApp().secret_jwt_refresh,
    );

    if (!tokenOld) throw new UnauthorizedException('Token invalido');

    const payload: PayloadDto = {
      email: tokenOld.email,
      id: tokenOld.id,
      provider: tokenOld.provider,
    };

    const newToken = this.tokenService.refreshJWTToken(payload);

    return newToken;
  }

  /**
   * Updates the user's active status in the database.
   *
   * @param id - The unique identifier of the user to be updated.
   * @param active - The new active status to be set for the user.
   * @returns A promise that resolves to the updated user record if successful,
   *          or rejects with an error if the update fails.
   */
  async saveUser(id: string, active: boolean) {
    const partialUpdate: Partial<UpdateUserDto> = {
      active: active,
    };

    return await this.userRepository.updateUser(
      id,
      partialUpdate as unknown as UsersEntity,
    );
  }

  /**
   * Validates if a given email already exists in the database.
   *
   * @param email - The email to be validated.
   * @param id - The ID of the user to be excluded from the validation (optional).
   * @returns A promise that resolves to void if the email does not exist in the database,
   *          or rejects with a BadRequestException if the email already exists.
   *
   * @remarks
   * This function retrieves the user record from the database using the provided email.
   * If the user exists and the ID provided is different from the user's ID,
   * a BadRequestException is thrown with the message "USER_ALREADY_EXIST".
   * If the user does not exist, the function resolves with void.
   */
  async validateEmailBD(email: string, id?: string): Promise<void> {
    const existInBD = await this.userRepository.userAlreadyExists(email, id);

    if (existInBD) {
      throw new BadRequestException(UserMessagesError.USER_ALREADY_EXIST);
    }
  }

  // Google functions
  /**
   * Validates a Google user by their email.
   *
   * @param email - The email of the Google user to validate.
   * @returns A promise that resolves to the user record if the user exists in the database,
   *          or `null` if the user does not exist.
   *
   * @remarks
   * This function retrieves the user record from the database using the provided email.
   * If the user exists, the function resolves with the user record.
   * If the user does not exist, the function resolves with `null`.
   */
  async validateGoogleUser(email: string): Promise<UsersEntity> {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Creates a new user account using the provided Google profile information.
   *
   * @param profile - The Google profile information containing user details.
   * @returns A promise that resolves to the newly created user record.
   * @throws An InternalServerErrorException if the user creation fails.
   *
   * @remarks
   * This function extracts user details from the Google profile, generates a random password,
   * hashes the password, and creates a new user record in the database.
   * If the user creation is successful, the function resolves with the newly created user record.
   * If the user creation fails, an InternalServerErrorException is thrown.
   */
  async createAccountGoogleUser(profile: GoogleResponse): Promise<UsersEntity> {
    const {
      emails,
      photos,
      name: { givenName, familyName },
      provider,
      id,
    } = profile;

    const email = emails[0].value;
    const avatar = photos[0].value;

    const pass = generateRandomWord();
    const password = await hashPassword(pass);

    const newUser: Partial<UsersEntity> = {
      firstName: givenName,
      lastName: familyName,
      email,
      avatar,
      password,
      provider,
      providerId: id,
      active: true,
    };

    const data: UsersEntity = plainToInstance(UsersEntity, newUser);

    const userNew = await this.userRepository.saveUser(data);

    if (!userNew) {
      throw new InternalServerErrorException(
        UserMessagesError.INTERNAL_SERVER_ERROR,
      );
    }

    return userNew;
  }

  /**
   * Generates a URL for redirecting the user to the front-end application after successful Google login.
   *
   * This function takes a `UsersEntity` object as input, which represents a user record from the database.
   * It creates a JWT token payload using the user's email, ID, and provider.
   * The JWT token is then generated using the `generateJWTToken` method of the `tokenService`.
   * The generated token is passed to the `cifrateResponseGoogle` method to obtain the final token string.
   * Finally, the function constructs a URL for redirecting the user to the front-end application,
   * appending the final token string as a query parameter.
   *
   * @param user - The `UsersEntity` object representing the user record from the database.
   * @returns A string containing the URL for redirecting the user to the front-end application after successful Google login.
   */
  loginWithGoogleAccount(user: UsersEntity): string {
    const payload: PayloadDto = {
      email: user.email,
      id: user.id,
      provider: user.provider,
    };

    const token = this.tokenService.generateJWTToken(payload, true, '', user);

    const tokenFinal = this.cifrateResponseGoogle(token as LoginResponseAuth);

    return `${configApp().frontHost}/google?token=${tokenFinal}`;
  }

  /**
   * Cifrates the response payload for Google login.
   *
   * This function takes a `LoginResponseAuth` object as input, which contains the necessary data for generating a JWT token.
   * If the `payload` parameter is not null, it calls the `generateJWTTokenGoogle` method of the `tokenService` to create a JWT token.
   * The generated token is then returned as a string. If the `payload` parameter is null, the function returns null.
   *
   * @param payload - The `LoginResponseAuth` object containing the necessary data for generating the JWT token.
   * @returns A string containing the JWT token for Google login, or null if the `payload` parameter is null.
   */
  cifrateResponseGoogle(payload: LoginResponseAuth): string | null {
    return payload ? this.tokenService.generateJWTTokenGoogle(payload) : null;
  }
}
