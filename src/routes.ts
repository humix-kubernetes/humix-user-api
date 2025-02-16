import { Router } from "express"
import { registrarUsuario } from "./userController"

const userRouter = Router()

userRouter.post("/registrar", registrarUsuario)

export default userRouter