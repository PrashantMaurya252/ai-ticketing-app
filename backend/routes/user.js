import express from 'express'
import { getUser, login, logout, signup, updateUser } from '../controllers/user.js'
import { authenticate } from '../middlewares/auth.js'

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

router.post("/update-user",authenticate,updateUser)
router.get("/get-users",getUser)



export default router