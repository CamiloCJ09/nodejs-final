import GroupModel, { GroupInput, GroupDocument } from "../models/group.model"
import UserModel, { UserInput } from "../models/user.model"

/**
 * GroupService class provides methods for managing groups and users.
 * @class
 */
class GroupService {
  /**
   * Creates a new group.
   * @param {GroupInput} groupInput - Data for creating the group.
   * @returns {Promise<GroupDocument>} A Promise that resolves to the created GroupDocument.
   */
  async createGroup(groupInput: GroupInput) {
    const group = new GroupModel(groupInput)
    await group.save()
    return group
  }

  /**
   * Adds users to an existing group.
   * @param {string} groupId - ID of the group to which users will be added.
   * @param {string[]} userIds - IDs of users to be added to the group.
   * @returns {Promise<GroupDocument>} A Promise that resolves to the updated GroupDocument after adding users.
   * @throws {Error} Throws an error if the group or users are not found.
   */
  async addUsersToGroup(groupId: string, userIds: string[]) {
    const group = await GroupModel.findById(groupId)
    if (!group) {
      throw new Error("Group not found")
    }
    const users = await UserModel.find({ _id: { $in: userIds } })
    if (users.length !== userIds.length) {
      throw new Error("User not found")
    }
    group.users = group.users.concat(userIds)
    await group.save()
    return group
  }

  /**
   * Retrieves all groups.
   * @returns {Promise<GroupDocument[]>} A Promise that resolves to an array of GroupDocuments representing all groups.
   */
  async findAll() {
    return GroupModel.find()
  }

  /**
   * Finds a group by its ID.
   * @param {string} id - ID of the group to find.
   * @returns {Promise<GroupDocument | null>} A Promise that resolves to the found GroupDocument or null if not found.
   */
  async findById(id: string) {
    return GroupModel.findById(id)
  }

  /**
   * Deletes a group by its ID.
   * @param {string} id - ID of the group to delete.
   * @returns {Promise<GroupDocument | null>} A Promise that resolves to the deleted GroupDocument or null if not found.
   */
  async deleteById(id: string) {
    return GroupModel.findByIdAndDelete(id)
  }

  public async findByName(name: string): Promise<GroupDocument | null> {
    try {
      const group = await GroupModel.findOne({ name: name })
      return group
    } catch (error) {
      throw error
    }
  }

  /**
   * Adds a user to a group.
   * @param {string} id - ID of the group to which the user will be added.
   * @param {UserInput} userInput - Data for adding the user.
   * @returns {Promise<void>} A Promise that resolves after adding the user to the group.
   * @throws {Error} Throws an error if the user, group, or if the user is already in the group.
   */
  async addMember(id: string, userInput: UserInput) {
    try {
      const user = await UserModel.findOne({ name: userInput.name })
      if (!user) {
        throw new Error("User not found")
      }

      const groupToAdd = await GroupModel.findById(id)
      if (!groupToAdd) {
        throw new Error("Group not found")
      }

      if (groupToAdd.users.includes(user._id)) {
        throw new Error("User already in group")
      }

      groupToAdd.users.push(user._id)
      user.groups?.push(groupToAdd._id)
      await user.save()
      await groupToAdd.save()
    } catch (error) {
      throw error
    }
  }

  /**
   * Removes a user from a group.
   * @param {string} id - ID of the group from which the user will be removed.
   * @param {string} userId - ID of the user to be removed.
   * @returns {Promise<void>} A Promise that resolves after removing the user from the group.
   * @throws {Error} Throws an error if the user, group, or if the user is not in the group.
   */
  async removeMember(id: string, userId: string) {
    try {
      const userToRemove = await UserModel.findById(userId)
      if (!userToRemove) {
        throw new Error("User not found")
      }

      const group = await GroupModel.findById(id)
      if (!group) {
        throw new Error("Group not found")
      }

      if (!group.users.includes(userToRemove._id)) {
        throw new Error("User not in group")
      }

      await GroupModel.updateOne(
        { _id: id },
        { $pull: { users: userToRemove._id } }
      )
      await UserModel.updateOne(
        { _id: userId },
        { $pull: { groups: group._id } }
      )
    } catch (error) {
      throw error
    }
  }

  public async update(
    id: string,
    groupInput: GroupInput
  ): Promise<GroupDocument | null> {
    try {
      const groupUpdated = await GroupModel.updateOne({ _id: id }, groupInput)
      if (groupUpdated) {
        const group = await GroupModel.findById(id)
        return group
      }
      return null
    } catch (error) {
      throw error
    }
  }

  public async delete(id: string): Promise<GroupDocument | null> {
    try {
      const group = await GroupModel.findByIdAndDelete(id)
      return group
    } catch (error) {
      throw error
    }
  }
  /**
   * Retrieves groups associated with a user by username.
   * @param {string} userName - Username of the user to find associated groups.
   * @returns {Promise<GroupDocument[]>} A Promise that resolves to an array of GroupDocuments associated with the user.
   * @throws {Error} Throws an error if the user is not found.
   */
  async getGroupsByUser(userName: string) {
    try {
      const userExist = await UserModel.findOne({ name: userName })
      if (!userExist) {
        throw new Error("User not found")
      }

      const groups = await GroupModel.find({ users: userExist._id })
      return groups
    } catch (error) {
      throw error
    }
  }
}

export default new GroupService()
