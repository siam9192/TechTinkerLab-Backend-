import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidations } from "./post.validation";
import { PostController } from "./post.controller";

const router = Router()


router.post('/create',auth('USER'),validateRequest(PostValidations.CreatePostValidationSchema),PostController.createPost)

router.get('/',PostController.getPosts)
router.get('/user-read/:postId',auth('USER'),PostController.getPostForUserRead)

router.put('/:postId',auth('USER'),validateRequest(PostValidations.UpdatePostValidationSchema),PostController.updatePost)
router.delete('/:postId',auth('USER'),PostController.deletePost)
export const PostRouter = router