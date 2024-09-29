export interface IAccountRecoverRequest {
  email: string;
  otp: string;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
