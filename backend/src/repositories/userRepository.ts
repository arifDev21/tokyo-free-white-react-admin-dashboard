import User, { IUser } from "../models/User";

export class UserRepository {
  async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      throw new Error(`Error finding user by username: ${error}`);
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error}`);
    }
  }

  async create(userData: {
    username: string;
    passwordHash: string;
  }): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      return await User.find().select("-passwordHash");
    } catch (error) {
      throw new Error(`Error finding all users: ${error}`);
    }
  }
}
