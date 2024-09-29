import bcrypt from 'bcrypt';
import config from '../config';

export const bcryptHash = async (data: string) =>
  await bcrypt.hash(data, Number(config.bcrypt_salt_rounds));

export const bcryptCompare = async (data: string, hashedData: string) =>
  await bcrypt.compare(data, hashedData);
