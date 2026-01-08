import { StatusCodes } from "http-status-codes";
import Topic, { ITopicDocument } from "../models/topic.model";
import { ITopic } from "../types/topic.type";
import ResponseError from "../utils/error";
import { topicSchema } from "../validation/topic.schema";
import validate from "../validation/validation";

const topicServices = {
  getAll: async () => {
    const topics = await Topic.find({}, "name");

    return { data: topics };
  },

  create: async (data: ITopic) => {
    const value = validate(topicSchema, data);

    const existingTopic = await Topic.findOne({ name: value.name });
    if (existingTopic) {
      throw new ResponseError("Topic already exists", StatusCodes.CONFLICT);
    }
    const topic = await Topic.create(value);
    return { data: topic.toJSON() };
  },

  delete: async (id: string) => {
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    return { data: null };
  },
};

export default topicServices;
