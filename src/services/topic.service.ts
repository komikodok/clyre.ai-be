import { StatusCodes } from "http-status-codes";
import Topic, { ITopicDocument } from "../models/topic.model";
import { ITopic } from "../types/topic.type";
import ResponseError from "../utils/error";
import { topicSchema } from "../validation/topic.schema";
import validate from "../validation/validation";

const topicServices = {
  getAll: async (): Promise<ITopicDocument[]> => {
    const topics = await Topic.find({});

    return topics;
  },

  create: async (data: ITopic): Promise<ITopicDocument> => {
    const value = validate(topicSchema, data);

    const existingTopic = await Topic.findOne({ name: value.name });
    if (existingTopic) {
      throw new ResponseError("Topic already exists", StatusCodes.CONFLICT);
    }
    const topic = await Topic.create(value);
    return topic;
  },

  delete: async (id: string): Promise<ITopicDocument | null> => {
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    return topic;
  },
};

export default topicServices;
