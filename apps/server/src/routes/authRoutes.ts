import { Router } from "express";
import { loginSchema, registerSchema } from "validation";
import { validateBody } from "../middleware/validate";
import { login, register } from "../controllers/authController";


const router  = Router()

router.post('/register',validateBody(registerSchema),register)
router.post('login',validateBody(loginSchema),login)

export default router