import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendSuccessResponse } from "../../response";
import {Request,Response} from 'express'
import { UserActivityService } from "./user-activity.service";
const getUsersActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await UserActivityService.getUsersActivity(req.query)
    const data = result.result;
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User activity retrieved  successfully',
      data: data,
      meta:result.meta
    });
  });
  

export const UserActivityController = {
    getUsersActivity
}