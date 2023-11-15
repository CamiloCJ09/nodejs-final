import UserModel, { UserInput, UserDocument } from "../models/user.model";
import GroupModel from '../models/group.model';

/**
 * UserService class provides methods for managing users and their relationships with groups.
 * @class
 */
class UserService {
  /**
   * Creates a new user.
   * @param {UserInput} userInput - Data for creating the user.
   * @returns {Promise<UserDocument>} A Promise that resolves to the created UserDocument.
   */
  async createUser(userInput) {
    const user = new UserModel(userInput);
    await user.save();
    return user;
  }

  /**
   * Adds groups to an existing user.
   * @param {string} userId - ID of the user to which groups will be added.
   * @param {string[]} groupIds - IDs of groups to be added to the user.
   * @returns {Promise<UserDocument>} A Promise that resolves to the updated UserDocument after adding groups.
   * @throws {Error} Throws an error if the user or groups are not found.
   */
  async addGroupsToUser(userId: string, groupIds: string[]) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const groups = await GroupModel.find({ _id: { $in: groupIds } });
    if (groups.length !== groupIds.length) {
      throw new Error("Group not found");
    }
    try {
      if (user.groups) {
        user.groups = user.groups.concat(groupIds);
      } else {
        user.groups = [...groupIds];
      }
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Retrieves all users.
   * @returns {Promise<UserDocument[]>} A Promise that resolves to an array of UserDocuments representing all users.
   */
  async findAll() {
    return UserModel.find();
  }

  /**
   * Finds a user by its ID.
   * @param {string} id - ID of the user to find.
   * @returns {Promise<UserDocument | null>} A Promise that resolves to the found UserDocument or null if not found.
   */
  async findById(id: string) {
    return UserModel.findById(id);
  }

  /**
   * Deletes a user by its ID.
   * @param {string} id - ID of the user to delete.
   * @returns {Promise<UserDocument | null>} A Promise that resolves to the deleted UserDocument or null if not found.
   */
  async deleteById(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

  /**
   * Adds a group to a user.
   * @param {string} id - ID of the user to which the group will be added.
   * @param {UserInput} groupInput - Data for adding the group.
   * @returns {Promise<void>} A Promise that resolves after adding the group to the user.
   * @throws {Error} Throws an error if the group, user, or if the group is already in the user.
   */
  async addGroup(id: string, groupInput: UserInput) {
    try {
      const group = await GroupModel.findOne({ name: groupInput.name });
      if (!group) {
        throw new Error("Group not found");
      }
      const userToAdd = await UserModel.findById(id);
      if (!userToAdd) {
        throw new Error("User not found");
      }
      if (userToAdd.groups?.includes(group._id)) {
        throw new Error("Group already in user");
      }
      userToAdd.groups?.push(group._id);
      group.users.push(userToAdd._id);
      await userToAdd.save();
      await group.save();
    } catch (err) {
      throw err;
    }
  }

  /**
   * Finds a user by email.
   * @param {string} email - Email of the user to find.
   * @returns {Promise<UserDocument | null>} A Promise that resolves to the found UserDocument or null if not found.
   * @throws {Error} Throws an error if an error occurs during the operation.
   */
  public async findByEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email: email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a user by ID with new data.
   * @param {string} id - ID of the user to update.
   * @param {UserInput} userInput - Data for updating the user.
   * @returns {Promise<UserDocument | null>} A Promise that resolves to the updated UserDocument or null if not found.
   * @throws {Error} Throws an error if an error occurs during the operation.
   */
  public async update(id: string, userInput: UserInput) {
    try {
      const userUpdated = await UserModel.updateOne({ _id: id }, userInput);
      if (userUpdated) {
        const user = await UserModel.findById(id);
        return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a user by ID.
   * @param {string} id - ID of the user to delete.
   * @returns {Promise<UserDocument | null>} A Promise that resolves to the deleted UserDocument or null if not found.
   * @throws {Error} Throws an error if an error occurs during the operation.
   */
  public async delete(id: string) {
    try {
      const user = await UserModel.findByIdAndDelete(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves users associated with a group by group name.
   * @param {string} groupName - Name of the group to find associated users.
   * @returns {Promise<UserDocument[]>} A Promise that resolves to an array of UserDocuments associated with the group.
   * @throws {Error} Throws an error if an error occurs during the operation.
   */
  public async getUsersByGroup(groupName:string) {
    try {
      const group = await GroupModel.findOne({ name: groupName });
      if (group) {
        const users = await UserModel.find({ _id: { $in: group.users } });
        return users;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }
}
