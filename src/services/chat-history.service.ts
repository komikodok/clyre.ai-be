import ChatMessageRepository from "../repositories/chat-message.repository";

class ChatHistoryService {
  async getAll(topic: string, user_id: string) {
    const { rawMessages } = await ChatMessageRepository.getChatHistory(
      topic,
      user_id,
    );

    return {
      data: {
        messages: rawMessages,
      },
    };
  }

  async delete(topic: string, user_id: string) {
    const result = await ChatMessageRepository.deleteChatHistory(
      topic,
      user_id,
    );

    return {
      data: null,
    };
  }
}

export const chatHistoryService = new ChatHistoryService();
