// Import necessary modules
import { Request, Response } from "express";
import userService from "../services/user.service";
import { UserDocument } from "../models/user.model";
import bcrypt from "bcrypt";
import authServices from "../middleware/auth";

// Define a class to encapsulate user-related API logic
class UserController {
  // Method to create a new user
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Check if a user with the given email already exists
      const userExist: UserDocument | null = await userService.findByEmail(req.body.email);
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the user's password before saving it
      req.body.password = await bcrypt.hash(req.body.password, 10);
      // Create the user and return the result
      const user: UserDocument = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      // Handle any errors that occur during user creation
      return res.status(500).json({ error: error });
    }
  }

  // Method to retrieve all users
  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve all users from the service layer
      const users: UserDocument[] = await userService.findAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Users not found" });
      }
      // Return the list of users
      return res.status(200).json(users);
    } catch (error) {
      // Handle any errors that occur during user retrieval
      return res.status(500).json({ error: error });
    }
  }

  // Method to retrieve a user by ID
  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve a user by ID from the service layer
      const user: UserDocument | null = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Return the found user
      return res.status(200).json(user);
    } catch (error) {
      // Handle any errors that occur during user retrieval by ID
      return res.status(500).json({ error: error });
    }
  }

  // Method to handle user login
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      // Find a user by email to perform login
      const user: UserDocument | null = await userService.findByEmail(req.body.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }

      // Compare the provided password with the hashed password stored in the database
      const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate a JWT token for the authenticated user
      const token = authServices.generateToken(user);

      // Return the user's email and the generated token
      return res.status(200).json({ email: user.email, token: token });
    } catch (error) {
      // Handle any errors that occur during the login process
      return res.status(500).json({ error: error });
    }
  }

  // Method to update a user by ID
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      // Find a user by ID before updating
      const user: UserDocument | null = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If a new password is provided, hash it before updating
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      // Update the user and return the updated result
      const updatedUser: UserDocument | null = await userService.update(req.params.id, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      // Handle any errors that occur during user update
      return res.status(500).json({ error: error });
    }
  }

  // Method to delete a user by ID
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      // Delete a user by ID and return the deleted user
      const deletedUser: UserDocument | null = await userService.delete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(deletedUser);
    } catch (error) {
      // Handle any errors that occur during user deletion
      return res.status(500).json({ error: error });
    }
  }

  // Method to retrieve users by group name
  public async getUsersByGroup(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve users by group name from the service layer
      const users: UserDocument[] = await userService.getUsersByGroup(req.params.groupName);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Users not found" });
      }
      // Return the list of users in the specified group
      return res.status(200).json(users);
    } catch (error) {
      // Handle any errors that occur during user retrieval by group name
      return res.status(500).json({ error: error });
    }
  }
}

// Export an instance of the UserController class
export default new UserController();
