import { Router } from "express";
import { OverviewController } from "./overview.controller";
import auth from "../../middlewares/auth";

const router = Router()

router.get('/admin',OverviewController.getAdminOverview)

router.get('/current-user',auth('USER'),OverviewController.getCurrentUserOverview)

export const OverviewRouter = router