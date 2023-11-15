//Dependencies
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";
import dotenv from "dotenv";

//enviroment variables
dotenv.config();

const secretKey = process.env.JWT_SECRET || "secret";  //secret key for jwt token it has a default value of "secret"
const currentTimestamp = Math.floor(Date.now() / 1000); //current timestamp in seconds for checking if token is expired

// const used for checking if the request is authorized by checking the token at authorization header
// if the token is valid it will proceed to the next middleware
// if the token is invalid it will return an error
// if the token is expired it will refresh the token and proceed to the next middleware
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (isTokenExpired(token)) {
      console.log("token expired, refreshing.....");
      token = refreshToken(token);
    }

    const decoded = jwt.verify(token, secretKey);
    req.body.loggedUser = decoded;

    console.log("decoded token ", req.body.loggedUser);

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};

// const used for generating a new token with the user's email and role as payload
// the token will expire in 24 hours by deafult or any value set in the .env file
// if the there is an error in generating the token it will throw an error
const generateToken = (user: UserDocument) => {
  console.log("generating  new token");
  try {
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "24h",
    });
    return token;
  } catch (error) {
    throw error;
  }
};

// const used for checking if the user has any of the required roles for accessing a resource
// if the user has any of the required roles it will proceed to the next middleware
// if the user does not have any of the required roles it will return an error
// or if the user is not logged in it will return an error
const hasAnyRole =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      if (!isJwtPayload(decoded) || !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          message:
            "You do not have the authorization and permissions to access this resource.",
        });
      }

      next();
    });
  };

//Auxilar functions

// axuilar function for checking if the decoded token is a jwt payload 
// it will return true if the decoded token has a role property
// it is used at the hasyAnyRole function
function isJwtPayload(decoded: any): decoded is jwt.JwtPayload {
  return decoded && typeof decoded === "object" && "role" in decoded;
}

// auxilar function for checking if the token is expired
// it will return true if the token is expired or false if it is not
// it is used at the auth function
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.verify(token, secretKey) as { exp: number };
    console.log("current expiration time ", decoded.exp);
    return decoded.exp < currentTimestamp;
  } catch (error) {
    return true;
  }
}

// axuilar function for refreshing the token
// it will return a new token with the same email and role as payload
// it is used at the auth function
function refreshToken(token: string): string {
    console.log("refreshing token....");
  const tokenPayload = jwt.decode(token) as jwt.JwtPayload;
  return generateToken({
    email: tokenPayload.email,
    role: tokenPayload.role,
  } as UserDocument);
}

// const used for exporting the functions in order to be used in other files
const authServices = {
  auth,
  generateToken,
  hasAnyRole,
};
export default authServices;