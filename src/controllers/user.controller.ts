import { Request, Response } from "express";
import userService from "../services/user.service";
import {UserDocument } from "../models/user.model";
import bcrypt from "bcrypt";
import authServices from "../middleware/auth";

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const userExist: UserDocument | null = await userService.findByEmail(
        req.body.email
      );
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user: UserDocument = await userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const users: UserDocument[] = await userService.findAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Users not found" });
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const user: UserDocument | null = await userService.findById(
        req.params.id
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const user: UserDocument | null = await userService.findByEmail(
        req.body.email
      );
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }
      const validPassword: boolean = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token =  authServices.generateToken(user);

      return res.status(200).json({ email: user.email, token: token });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user: UserDocument | null = await userService.findById(
        req.params.id
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      const updatedUser: UserDocument | null = await userService.update(
        req.params.id,
        req.body
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const deletedUser: UserDocument | null = await userService.delete(
        req.params.id
      );
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(deletedUser);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async  getUsersByGroup(req: Request, res: Response): Promise<Response>{
      try{
          const users: UserDocument[] = await userService.getUsersByGroup(req.params.groupName);
          if(!users || users.length === 0){
              return res.status(404).json({message: "Users not found"});
          }
          return res.status(200).json(users);
      }catch(error){
          return res.status(500).json({error: error});
      }
  }
}

export default new UserController();