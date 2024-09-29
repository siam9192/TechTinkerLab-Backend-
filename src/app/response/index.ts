import { Response } from 'express';
import httpStatus from 'http-status';

type TResponseData = {
  statusCode: number;
  message: string;
  data: any;
  meta?: any;
};

export const sendSuccessResponse = (
  res: Response,
  responseData: TResponseData,
) => {
  res.status(responseData.statusCode).json({
    success: true,
    statusCode: responseData.statusCode,
    message: responseData.message,
    data: responseData.data,
    meta: responseData.meta || null,
  });
};

export const sendDataNotFoundResponse = (res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: 'No Data Found',
    data: [],
  });
};

export const sendNoAccessResponse = (res: Response) => {
  res.status(httpStatus.UNAUTHORIZED).json({
    success: false,
    statusCode: 401,
    message: 'You have no access to this route',
  });
};
