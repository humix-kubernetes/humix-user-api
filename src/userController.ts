import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import bcrypt from "bcrypt"

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


// pegar informações do usuário






// funções



function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSenha(senha: string): boolean {
    return /^\w{8,}$/.test(senha);
}