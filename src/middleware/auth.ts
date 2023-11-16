import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UserDocument } from "../models/user.model"
import dotenv from "dotenv"

dotenv.config()

const secretKey = process.env.JWT_SECRET || "secret"
const currentTimestamp = Math.floor(Date.now() / 1000);

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "Not authorized" })
    }

    if (isTokenExpired(token)) {
      console.log("token expired, refreshing.....")
      token = refreshToken(token)
    }

    const decoded = jwt.verify(token, secretKey)
    req.body.loggedUser = decoded

    console.log("decoded token ", req.body.loggedUser)

    next()
  } catch (error) {
    return res.status(500).json(error)
  }
}

const generateToken = (user: UserDocument) => {
  console.log("generating  new token")
  try {
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "24h",
    })
    return token
  } catch (error) {
    throw error
  }
}

const hasAnyRole =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "Not logged in" })
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message })
      }
      if (!isJwtPayload(decoded) || !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          message:
            "You do not have the authorization and permissions to access this resource.",
        })
      }

      next()
    })
  }

function isJwtPayload(decoded: any): decoded is jwt.JwtPayload {
  return decoded && typeof decoded === "object" && "role" in decoded
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.verify(token, secretKey) as { exp: number }
    console.log("current expiration time ", decoded.exp)
    return decoded.exp < currentTimestamp
  } catch (error) {
    return true
  }
}

function refreshToken(token: string): string {
  console.log("refreshing token....")
  const tokenPayload = jwt.decode(token) as jwt.JwtPayload
  return generateToken({
    email: tokenPayload.email,
    role: tokenPayload.role,
  } as UserDocument)
}

const authServices = {
  auth,
  generateToken,
  hasAnyRole,
}
export default authServices
