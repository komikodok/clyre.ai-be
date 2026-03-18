import Memory from "../models/memory.model";
import User from "../models/user.model";

export class MemoryRepository {
  static async getMemoryByUsername(username: string) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return [];
      }

      const memory = await Memory.findOne({ user_id: user._id });
      return memory?.contents || [];
    } catch (error) {
      return [];
    }
  }
}
