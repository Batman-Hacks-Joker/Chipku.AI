"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ChatMessage } from "@/lib/types";

interface TopWordsByUserProps {
  messages: ChatMessage[];
  users: string[];
}

export function TopWordsByUser({ messages, users }: TopWordsByUserProps) {
  const topWordsByUser = useMemo(() => {
    const userWordCounts: Record<string, Record<string, number>> = {};

    const wordRegex = /^[a-zA-Z]{3,}/; // Words with at least 3 letters
    const trailingSpecialCharsRegex = /[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]+$/;

    messages.forEach((message) => {
      const user = message.author;
      const words = message.message.split(/\s+/);

      if (!userWordCounts[user]) {
        userWordCounts[user] = {};
      }

      words.forEach((word) => {
        const cleanedWord = word.replace(trailingSpecialCharsRegex, "").toLowerCase();

        if (wordRegex.test(cleanedWord)) {
          userWordCounts[user][cleanedWord] =
            (userWordCounts[user][cleanedWord] || 0) + 1;
        }
      });
    });

    const topWords: Record<string, { word: string; count: number }[]> = {};

    users.forEach((user) => {
      const sortedWords = Object.entries(userWordCounts[user] || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15);

      if (sortedWords.length > 0) {
        topWords[user] = sortedWords.map(([word, count]) => ({ word, count }));
      }
    });

    return topWords;
  }, [messages, users]);

  const validUsers = Object.keys(topWordsByUser);

  if (validUsers.length === 0) {
    return null; // or show a message like "No valid word data for any user"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">
          Top 15 Most Common Words by User
        </CardTitle>
        <CardDescription>
          Most frequently used words by each user within the selected date range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {validUsers.map((user) => (
            <div key={user} className="pb-4 border-b last:border-b-0">
              <h3 className="text-lg font-semibold">{user}</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {topWordsByUser[user].map(({ word, count }) => (
                  <li key={word} className="text-sm text-muted-foreground">
                    {word} ({count})
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
