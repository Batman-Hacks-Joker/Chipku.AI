"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/types";

interface RandomMessagePerUserProps {
  messages: ChatMessage[];
}

export function RandomMessagePerUser({ messages }: RandomMessagePerUserProps) {
  const [randomMessages, setRandomMessages] = React.useState<Record<string, ChatMessage>>({});

  const messagesByUser = React.useMemo(() => {
    const grouped: Record<string, ChatMessage[]> = {};
    messages.forEach((message) => {
      if (!grouped[message.author]) {
        grouped[message.author] = [];
      }
      grouped[message.author].push(message);
    });
    return grouped;
  }, [messages]);

  const handleRandomizeClick = () => {
    const newRandomMessages: Record<string, ChatMessage> = {};

    Object.entries(messagesByUser).forEach(([user, userMessages]) => {
      if (userMessages.length > 0) {
        const randomIndex = Math.floor(Math.random() * userMessages.length);
        newRandomMessages[user] = userMessages[randomIndex];
      }
    });

    setRandomMessages(newRandomMessages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Random Message per User</CardTitle>
        <CardDescription>
          Get a random message from each active user in the selected date range.
        </CardDescription>
        <Button onClick={handleRandomizeClick} className="mt-2">
          Randomize
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {Object.entries(randomMessages).map(([user, message]) => (
            <div key={user}>
              <h3 className="text-lg font-semibold">{user}</h3>
              <p className="text-muted-foreground italic">"{message.message}"</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
