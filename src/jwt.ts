import jwt from "jsonwebtoken"

const SECRET_KEY = 'humix-private-key-for-login'

export function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
}

