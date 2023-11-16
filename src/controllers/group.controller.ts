// Import necessary modules
import { Request, Response } from "express";
import groupService from "../services/group.service";
import { GroupDocument } from "../models/group.model";

// Define a class to encapsulate group-related API logic
class GroupController {
  // Method to create a new group
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      // Check if a group with the given name already exists
      const groupExist: GroupDocument | null = await groupService.findByName(req.body.name);
      if (groupExist) {
        return res.status(400).json({ message: "Group already exists" });
      }

      // Create the group and return the result
      const group: GroupDocument = await groupService.createGroup(req.body);
      return res.status(201).json(group);
    } catch (error) {
      // Handle any errors that occur during group creation
      return res.status(500).json({ error: error });
    }
  }

  // Method to retrieve all groups
  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve all groups from the service layer
      const groups: GroupDocument[] = await groupService.findAll();
      if (!groups || groups.length === 0) {
        return res.status(404).json({ message: "Groups not found" });
      }
      // Return the list of groups
      return res.status(200).json(groups);
    } catch (error) {
      // Handle any errors that occur during group retrieval
      return res.status(500).json({ error: error });
    }
  }

  // Method to retrieve a group by ID
  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve a group by ID from the service layer
      const group: GroupDocument | null = await groupService.findById(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      // Return the found group
      return res.status(200).json(group);
    } catch (error) {
      // Handle any errors that occur during group retrieval by ID
      return res.status(500).json({ error: error });
    }
  }

  // Method to update a group by ID
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve a group by ID before updating
      const group: GroupDocument | null = await groupService.update(req.params.id, req.body);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      // Return the updated group
      return res.status(200).json(group);
    } catch (error) {
      // Handle any errors that occur during group update
      return res.status(500).json({ error: error });
    }
  }

  // Method to delete a group by ID
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      // Delete a group by ID and return the deleted group
      const group: GroupDocument | null = await groupService.delete(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      return res.status(200).json(group);
    } catch (error) {
      // Handle any errors that occur during group deletion
      return res.status(500).json({ error: error });
    }
  }

  // Method to add a member to a group
  public async addMember(req: Request, res: Response): Promise<Response> {
    try {
      // Add a member to the group by ID
      await groupService.addMember(req.params.id, req.body);

      // Return success message
      return res.status(200).json({ message: "Member added to group" });
    } catch (error) {
      // Handle any errors that occur during member addition
      return res.status(500).json({ error: error });
    }
  }

  // Method to remove a member from a group
  public async removeMember(req: Request, res: Response): Promise<Response> {
    try {
      // Remove a member from the group by ID and member ID
      await groupService.removeMember(req.params.id, req.params.userId);
      
      // Return success message
      return res.status(200).json({ message: "Member removed from group" });
    } catch (error) {
      // Handle any errors that occur during member removal
      return res.status(500).json({ error: error });
    }
  }

  // Method to retrieve groups by user name
  public async getGroupsByUser(req: Request, res: Response): Promise<Response> {
    try {
      // Retrieve groups by user name from the service layer
      const groups: GroupDocument[] = await groupService.getGroupsByUser(req.params.userName);
      if (!groups || groups.length === 0) {
        return res.status(404).json({ message: "Groups not found" });
      }
      // Return the list of groups associated with the specified user
      return res.status(200).json(groups);
    } catch (error) {
      // Handle any errors that occur during group retrieval by user name
      return res.status(500).json({ error: error });
    }
  }
}

// Export an instance of the GroupController class
export default new GroupController();
