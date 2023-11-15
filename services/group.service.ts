import GroupModel, { GroupInput, GroupDocument } from "../models/group.model"
import UserModel, { UserInput } from "../models/user.model"

class GroupService {
  
  async createGroup(groupInput: GroupInput): Promise<GroupDocument> {
    const group = new GroupModel(groupInput)
    await group.save()
    return group
  }

  async addUsersToGroup(
    groupId: string,
    userIds: string[]
  ): Promise<GroupDocument> {
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

  async findAll(): Promise<GroupDocument[]> {
    return GroupModel.find()
  }

  async findById(id: string): Promise<GroupDocument | null> {
    return GroupModel.findById(id)
  }

  async deleteById(id: string): Promise<GroupDocument | null> {
    return GroupModel.findByIdAndDelete(id)
  }

  public async addMember(id: string, userInput: UserInput): Promise<void> {
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

  public async removeMember(id: string, userId: string): Promise<void> {
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

      group.users = group.users.filter((user) => user !== userToRemove._id)
      userToRemove.groups = userToRemove.groups?.filter((group) => group !== id)
      await userToRemove.save()
      await group.save()
    } catch (error) {
      throw error
    }
  }

  public async getGroupsByUser(userName: string): Promise<GroupDocument[]> {
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
