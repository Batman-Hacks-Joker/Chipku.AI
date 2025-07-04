import { parse, isValid } from 'date-fns';
import type { ChatMessage, ParsedChatData } from './types';

// Handles formats like:
// 23/06/2024, 19:44 - Author Name: Message
// 6/23/24, 7:44 PM - Author Name: Message
const WHATSAPP_REGEX = /^\[?(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}),? (\d{1,2}:\d{2}(?::\d{2})?(?: [AP]M)?)]? - ([^:]+): ([\s\S]*)/;


function parseTimestamp(dateStr: string, timeStr: string): Date | null {
  const formats = [
    'dd/MM/yyyy, HH:mm',
    'dd/MM/yy, HH:mm',
    'MM/dd/yy, hh:mm a',
    'M/d/yy, h:mm a',
  ];

  for (const fmt of formats) {
    const combinedStr = `${dateStr}, ${timeStr}`;
    const parsedDate = parse(combinedStr, fmt, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return null;
}


export const parseChatFile = (fileContent: string): Promise<ParsedChatData> => {
  return new Promise((resolve, reject) => {
    const lines = fileContent.split('\n');
    const messages: ChatMessage[] = [];
    const users = new Set<string>();
    let lastMessage: ChatMessage | null = null;

    for (const line of lines) {
      const match = line.match(WHATSAPP_REGEX);
      if (match) {
        const [, dateStr, timeStr, author, messageText] = match;
        const timestamp = parseTimestamp(dateStr, timeStr);

        if (timestamp && author && messageText) {
          // Exclude system messages like "Messages and calls are end-to-end encrypted."
          if (author.length > 50) continue;

          const message: ChatMessage = {
            timestamp,
            author,
            message: messageText,
            wordCount: messageText.split(/\s+/).length,
          };
          messages.push(message);
          users.add(author);
          lastMessage = message;
        } else {
           if (lastMessage) {
            lastMessage.message += `\n${line}`;
            lastMessage.wordCount = lastMessage.message.split(/\s+/).length;
          }
        }
      } else if (lastMessage && line.trim().length > 0) {
        lastMessage.message += `\n${line}`;
        lastMessage.wordCount = lastMessage.message.split(/\s+/).length;
      }
    }

    if (messages.length === 0) {
      reject(new Error("No valid messages found."));
      return;
    }

    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const startDate = messages[0]?.timestamp || null;
    const endDate = messages[messages.length - 1]?.timestamp || null;

    resolve({
      messages,
      users: Array.from(users),
      startDate,
      endDate,
    });
  });
};
