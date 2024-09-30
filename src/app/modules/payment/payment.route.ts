import { Router } from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = Router()

router.get('/',auth('ADMIN','MODERATOR'),PaymentController.getPayments)

router.get('/current-user',auth('USER'),PaymentController.getCurrentUserPayments)


export const PaymentRouter = router