import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { generateToken } from "./jwt"

const userClient = new PrismaClient().user

// criar usuário
export const registrarUsuario = async (req: Request, res: Response) => {

    const {nome, email, senha} = req.body

    try{

        const emailUnico = await userClient.findUnique({where: {email: email}})

        if(!isValidEmail(email)){
            res.status(400).json({mensagem: "Email inválido"})
            return
        }

        if(!isValidSenha(senha)){
            res.status(400).json({mensagem: "A senha deve ter pelo menos 8 digitos"})
            return
        }

        if(emailUnico){
            res.status(400).json({mensagem: "Este email já foi cadastrado"})
            return
        }

        const hashedSenha = await bcrypt.hash(senha, 10)
        const usuario = await userClient.create({data: {nome, email, senha: hashedSenha as unknown as string}})

        res.status(201).json({data: usuario})

    }
    
    
    catch(err){
        res.status(400).json({error: err})
    }
}

// logar usuário
export const logarUsuario = async (req: Request, res: Response) => {

    const {email, senha} = req.body

    try{
        const usuario = await userClient.findUnique({where: {email: email}})

        if (!usuario){
            res.status(400).json({message: "usuário não cadastrado"})
            return
        }

        const isValidSenha = await bcrypt.compare(senha, usuario.senha)

        if(!isValidSenha){
            res.status(401).json({messagem: "senha incorreta"})
            return
        }

        const accessToken = generateToken({id: usuario.id, nome: usuario.nome, email: usuario.email, senha: usuario.senha})
        res.status(200).json({message: "usuário logado", toke: accessToken})
    }
    
    
    catch(err){
        res.status(400).json({error: err})
    }
}

// pegar informações do usuário






// funções

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSenha(senha: string): boolean {
    return /^\w{8,}$/.test(senha);
}