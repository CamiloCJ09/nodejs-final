import UserModel, { UserInput, UserDocument } from "../models/user.model";
import GroupModel from '../models/group.model';

class UserService{

    async createUser(userInput: UserInput): Promise<UserDocument>{
        const user = new UserModel(userInput);
        await user.save();
        return user;
    }

    async addGroupsToUser(userId: string, groupIds: string[]): Promise<UserDocument>{
      const user = await UserModel.findById(userId);
      if(!user){
        throw new Error("User not found");
      }
      const groups = await GroupModel.find({_id: {$in: groupIds}});
      if(groups.length !== groupIds.length){
        throw new Error("Group not found");
      }
      try{
        if(user.groups){
          user.groups = user.groups.concat(groupIds);
        } else {
          user.groups = [...groupIds];
        }
        await user.save();
        return user;
      } catch(err){
        throw err;
      }
    }

    async findAll(): Promise<UserDocument[]>{
        return UserModel.find();
    }

    async findById(id: string): Promise<UserDocument | null>{
        return UserModel.findById(id);
    }

    async deleteById(id: string): Promise<UserDocument | null>{
        return UserModel.findByIdAndDelete(id);
    }

    async addGroup(id: string, groupInput: UserInput): Promise<void>{
        try{
            const group = await GroupModel.findOne({name: groupInput.name});
            if(!group){
                throw new Error("Group not found");
            }
            const userToAdd = await UserModel.findById(id);
            if(!userToAdd){
                throw new Error("User not found");
            }
            if(userToAdd.groups?.includes(group._id)){
                throw new Error("Group already in user");
            }
            userToAdd.groups?.push(group._id);
            group.users.push(userToAdd._id);
            await userToAdd.save();
            await group.save();
        }catch(err){
            throw err;
        }
    }

    public async findByEmail(email: string): Promise<UserDocument | null> {
      try {
        const user = await UserModel.findOne({ email: email });
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    public async update(
      id: string,
      userInput: UserInput
    ): Promise<UserDocument | null> {
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
  
    public async delete(id: string): Promise<UserDocument | null> {
      try {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    public async getUsersByGroup(groupName: string): Promise<UserDocument[]> {
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