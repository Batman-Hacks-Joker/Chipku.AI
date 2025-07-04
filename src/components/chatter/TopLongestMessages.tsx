"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ChatMessage } from "@/lib/types";

interface TopLongestMessagesProps {
  messages: ChatMessage[];
  users: string[];
}

interface UserLongestMessages {
  user: string;
  messages: ChatMessage[];
}

export function TopLongestMessages({ messages, users }: TopLongestMessagesProps) {
  const [longestMessagesByUser, setLongestMessagesByUser] = React.useState<UserLongestMessages[]>([]);

  React.useEffect(() => {
    const userMessagesMap = new Map<string, ChatMessage[]>();

    messages.forEach((message) => {
      if (!userMessagesMap.has(message.author)) {
        userMessagesMap.set(message.author, []);
      }
      userMessagesMap.get(message.author)?.push(message);
    });

    const longestMessages: UserLongestMessages[] = [];

    users.forEach((user) => {
      const messagesForUser = userMessagesMap.get(user) || [];

      const sortedMessages = [...messagesForUser].sort(
        (a, b) =>
          wordCount(b.message) - wordCount(a.message) // Compute word count inline
      );

      const top5Messages = sortedMessages.slice(0, 5);

      if (top5Messages.length > 0) {
        longestMessages.push({ user, messages: top5Messages });
      }
    });

    setLongestMessagesByUser(longestMessages);
  }, [messages, users]);

  const wordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Top 5 Longest Messages Per User</CardTitle>
        <CardDescription>The longest messages sent by each user.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
          {longestMessagesByUser.map(({ user, messages }) => (
            <div key={user}>
              <h3 className="text-lg font-semibold">{user}</h3>
              <ul className="list-disc list-inside space-y-2">
                {messages.map((message, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    ({wordCount(message.message)} words): {message.message}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
