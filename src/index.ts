import express from "express"
import userRouter from "./routes"

const app = express()
const port = process.env.PORT || 8081

app.use(express.json())

app.use(userRouter)

app.get('/', (req, res) => {
    res.json({message: "Funcionando!"}).status(200)
})

app.listen(port, () => {
    console.log("rodando")
})