"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopWordsByUserProps {
  messages: ChatMessage[];
  users: string[];
}

export function TopWordsByUser({ messages, users }: TopWordsByUserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const allUserWordCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};
    const wordRegex = /^[a-zA-Z]{3,}/;
    const trailingSpecialCharsRegex = /[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]+$/;

    users.forEach(user => {
      counts[user] = {};
    });

    messages.forEach((message) => {
      const user = message.author;
      const words = message.message.split(/\s+/);
      if (!counts[user]) return;

      words.forEach((word) => {
        const cleanedWord = word.replace(trailingSpecialCharsRegex, "").toLowerCase();
        if (cleanedWord !== 'null' && cleanedWord !== 'edited' && cleanedWord !== 'omitted' && cleanedWord !== 'message' && wordRegex.test(cleanedWord)) {
          counts[user][cleanedWord] = (counts[user][cleanedWord] || 0) + 1;
        }
      });
    });
    return counts;
  }, [messages, users]);


  const topWordsByUser = useMemo(() => {
    const topWords: Record<string, { word: string; count: number }[]> = {};

    users.forEach((user) => {
      const userCounts = allUserWordCounts[user] || {};
      let sortedWords = Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15)
        .map(([word, count]) => ({ word, count }));
      
      if (activeSearch) {
        const searchedWordCount = userCounts[activeSearch.toLowerCase()];
        if (searchedWordCount) {
          // Remove from list if already present
          sortedWords = sortedWords.filter(item => item.word !== activeSearch.toLowerCase());
          // Add to the beginning
          sortedWords.unshift({ word: activeSearch.toLowerCase(), count: searchedWordCount });
        }
      }

      if (sortedWords.length > 0) {
        topWords[user] = sortedWords;
      }
    });

    return topWords;
  }, [allUserWordCounts, users, activeSearch]);

  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const validUsers = Object.keys(topWordsByUser);

  if (validUsers.length === 0) {
    return null;
  }

  return (
    <Card id="top-15-most-common-words-by-user">
      <CardHeader>
        <CardTitle className="font-headline">
          Top 15 Most Common Words by User
        </CardTitle>
        <CardDescription>
          Most frequently used words by each user within the selected date range.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
            <Input 
              type="text" 
              placeholder="Search word..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-card"
            />
            <Button type="submit" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
            <Button type="button" variant="destructive" size="icon" onClick={handleClearSearch}>
              <X className="h-4 w-4" />
            </Button>
        </div>
        <div className="overflow-y-auto max-h-[400px] pr-2">
          <div className="space-y-6">
            {validUsers.map((user) => (
              <div key={user} className="pb-4 border-b last:border-b-0">
                <h3 className="text-lg font-semibold">{user}</h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {topWordsByUser[user].map(({ word, count }) => (
                    <li key={word} className={cn(
                      "text-sm text-muted-foreground",
                      activeSearch && word.toLowerCase() === activeSearch.toLowerCase() && "text-primary font-bold bg-primary/10 px-2 rounded-md"
                    )}>
                      {word} ({count})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    