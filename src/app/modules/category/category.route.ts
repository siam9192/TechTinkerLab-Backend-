import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { z } from "zod";
import { CategoryController } from "./category.controller";

const router = Router()

router.post('/',auth('ADMIN','MODERATOR'),validateRequest(z.object({name:z.string()})),CategoryController.createCategory)

router.get('/',CategoryController.getCategories)

router.delete('/:categoryId',auth('ADMIN','MODERATOR'),CategoryController.deleteCategory)


export const CategoryRouter = router