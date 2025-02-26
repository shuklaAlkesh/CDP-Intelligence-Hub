import { type Message, type CDP } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function sendMessage(question: string, cdp: CDP): Promise<Message> {
  const response = await apiRequest("POST", "/api/chat", { question, cdp });
  return response.json();
}
