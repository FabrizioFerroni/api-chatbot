export enum AuthMessagesError {
  USER_PASSWORD_NOT_STRONG = 'Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special symbol.',
  USER_IS_NOT_ACTIVE = 'User disabled',
  USER_NOT_FOUND = 'User not found',
  PASSWORD_OR_EMAIL_INVALID = 'Invalid email or password. Please try again',
  USER_BLOCKED = 'User blocked. You have exceeded the maximum number of failed attempts. Please contact the application administrator',
  USER_EMAIL_VALID = 'You must enter a valid email format',
  INTERNAL_SERVER_ERROR = 'Internal server error. Contact with the administrator',
  USER_TOKEN_USED = 'The token sent is not valid or has already been used previously.',
  USER_MAIL_DIFFERENT = 'The user you have entered does not correspond to the one you previously registered with',
  USER_IS_NOT_LOCAL = 'User is not local',
}
