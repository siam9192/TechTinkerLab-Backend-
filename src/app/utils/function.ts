import { Types } from 'mongoose';

export const generateOTP = (length = 6) => {
  const numbers: number[] = [];

  for (let i = 0; i < length; i++) {
    const number = Math.round(Math.random() * 9);
    numbers.push(number);
  }
  return numbers.join('');
};

export const objectId = (id: string) => new Types.ObjectId(id);
