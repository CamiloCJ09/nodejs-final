import { Request, Response } from "express";
import groupService from "../services/group.service";
import { GroupDocument } from "../models/group.model";

class GroupController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const groupExist: GroupDocument | null = await groupService.findByName(
        req.body.name
      );
      if (groupExist) {
        return res.status(400).json({ message: "Group already exists" });
      }
      const group: GroupDocument = await groupService.createGroup(req.body);
      return res.status(201).json(group);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const groups: GroupDocument[] = await groupService.findAll();
      if (!groups || groups.length === 0) {
        return res.status(404).json({ message: "Groups not found" });
      }
      return res.status(200).json(groups);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const group: GroupDocument | null = await groupService.findById(
        req.params.id
      );
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const group: GroupDocument | null = await groupService.update(
        req.params.id,
        req.body
      );
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const group: GroupDocument | null = await groupService.delete(
        req.params.id
      );
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async addMember(req: Request, res: Response): Promise<Response> {
    try {
      await groupService.addMember(req.params.id, req.body);

      return res.status(200).json({ message: "Member added to group" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async removeMember(req: Request, res: Response): Promise<Response> {
    try {
      await groupService.removeMember(req.params.id, req.params.userId);
      return res.status(200).json({ message: "Member removed from group" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  public async getGroupsByUser(req: Request, res: Response): Promise<Response> {
    try {
      const groups: GroupDocument[] = await groupService.getGroupsByUser(
        req.params.userName
      );
      if (!groups || groups.length === 0) {
        return res.status(404).json({ message: "Groups not found" });
      }
      return res.status(200).json(groups);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

}

export default new GroupController();