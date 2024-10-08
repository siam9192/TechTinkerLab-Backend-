// eslint-disable no-unused-vars

import { HandleCastError } from './handleCastError';
import { HandleZodValidationError } from './handleZodValidationError';
import { HandleValidationError } from './handleValidationError';
import AppError from './AppError';
import { TErrorSource } from '../interface/error';
import { ZodError } from 'zod';
import config from '../config';
import { HandleDuplicateError } from './handleDuplicateError';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const GlobalErrorHandler: any = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: TErrorSource[] = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err?.name === 'CastError') {
    const errHandler = HandleCastError(err);
    statusCode = errHandler.statusCode;
    (message = errHandler.message), (errorMessages = errHandler.errorMessages);
  } else if (err?.code === 11000) {
    const errHandler = HandleDuplicateError(err);
    statusCode = errHandler?.statusCode;
    message = errHandler?.message;
    errorMessages = errHandler?.errorMessages;
  } else if (err instanceof ZodError) {
    const errHandler = HandleZodValidationError(err);
    statusCode = errHandler.statusCode;
    (message = errHandler.message), (errorMessages = errHandler.errorMessages);
  } else if (err?.name === 'ValidationError') {
    const errHandler = HandleValidationError(err);
    statusCode = errHandler.statusCode;
    (message = errHandler.message), (errorMessages = errHandler.errorMessages);
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};
