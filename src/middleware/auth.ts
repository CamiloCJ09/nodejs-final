// Import necessary modules
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";
import dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

// Set up the secret key for JWT, using a default value if not provided in the environment
const secretKey = process.env.JWT_SECRET || "secret";

// Calculate the current timestamp in seconds
const currentTimestamp = Math.floor(Date.now() / 1000);

// Middleware for authenticating incoming requests using JWT
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the JWT token from the Authorization header
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if the token is expired and refresh it if needed
    if (isTokenExpired(token)) {
      token = refreshToken(token);
    }

    // Verify the token and attach the decoded user information to the request body
    const decoded = jwt.verify(token, secretKey);
    req.body.loggedUser = decoded;

    // Log the decoded token for debugging purposes
    console.log("Decoded token:", req.body.loggedUser);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle authentication errors and respond with a 500 Internal Server Error
    return res.status(500).json(error);
  }
};

// Function to generate a new JWT token for a user
const generateToken = (user: UserDocument) => {
  try {
    const token = jwt.sign({ email: user.email, role: user.role }, secretKey, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || "24h",
    });
    return token;
  } catch (error) {
    // Throw any errors that occur during token generation
    throw error;
  }
};

// Middleware to check if the user has any of the required roles
const hasAnyRole =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // Verify the token and check if the user has the required roles
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

      // Continue to the next middleware or route handler
      next();
    });
  };

// Type guard to check if the decoded object is a valid JWT payload
function isJwtPayload(decoded: any): decoded is jwt.JwtPayload {
  return decoded && typeof decoded === "object" && "role" in decoded;
}

// Function to check if a JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.verify(token, secretKey) as { exp: number };
    return decoded.exp < currentTimestamp;
  } catch (error) {
    // Treat token verification failures as expired tokens
    return true;
  }
}

// Function to refresh an expired token
function refreshToken(token: string): string {
  console.log("Refreshing token...");
  const tokenPayload = jwt.decode(token) as jwt.JwtPayload;
  return generateToken({
    email: tokenPayload.email,
    role: tokenPayload.role,
  } as UserDocument);
}

// Bundle the authentication-related services into an object for export
const authServices = {
  auth,
  generateToken,
  hasAnyRole,
};

// Export the authentication services for use in other parts of the application
export default authServices;
