import express from "express";
import { user } from '../controllers'

const router = express.Router()

router.post("/auth/register", user.register)

router.post("/auth/login", user.authUser)


export default router;