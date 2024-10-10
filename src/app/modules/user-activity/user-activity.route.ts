import e, { Router } from "express";
import { UserActivityController } from "./user-activity.controller";
import auth from "../../middlewares/auth";

const router = Router()

router.get('/',
    auth('ADMIN'),
    UserActivityController.getUsersActivity)


export const UserActivityRouter = router