import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';
import { PostController } from './post.controller';

const router = Router();

router.post(
  '/create',
  auth('USER','MODERATOR','ADMIN'),
  validateRequest(PostValidations.CreatePostValidationSchema),
  PostController.createPost,
);

router.get('/', PostController.getPosts);
router.get('/by-id/:postId',auth('ADMIN','MODERATOR','USER'),PostController.getPost)
router.get('/current-user', auth('USER','MODERATOR','ADMIN'),PostController.getCurrentUserPost)
router.get('/profile/:username',PostController.getProfilePosts)

router.get(
  '/user-read/:postId',
  auth('USER','ADMIN','MODERATOR'),
  PostController.getPostForUserRead,
);


router.put(
  '/:postId',
   auth('USER','MODERATOR','ADMIN'),
  validateRequest(PostValidations.UpdatePostValidationSchema),
  PostController.updatePost,
);
router.delete('/:postId', auth('USER','MODERATOR','ADMIN'), PostController.deletePost);
export const PostRouter = router;


