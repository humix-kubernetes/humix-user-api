import { Router } from "express"
import { logarUsuario, registrarUsuario } from "./userController"

const userRouter = Router()

userRouter.post("/registrar", registrarUsuario)
userRouter.post("/login", logarUsuario)

export default userRouter