import { compare, hash } from 'bcrypt';

export async function validatePassword(password: string, userPassword: string) {
  return await compare(password, userPassword);
}

export async function hashPassword(pass: string) {
  return await hash(pass, 10);
}
