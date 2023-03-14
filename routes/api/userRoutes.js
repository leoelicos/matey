import Router from 'express'
const router = Router()
import {
  getUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend //
} from '../../controllers/userController.js'

router //
  .route('/')
  .get(getUsers)
  .post(createUser)

router //
  .route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser)

router //
  .route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend)

export default router
