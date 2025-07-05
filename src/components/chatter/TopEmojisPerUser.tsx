
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ChatMessage } from "@/lib/types";

interface TopEmojisPerUserProps {
  messages: ChatMessage[];
  users: string[];
}

interface EmojiData {
  name: string;
  value: number;
}

interface UserEmojiData {
  user: string;
  emojiData: EmojiData[];
}

export function TopEmojisPerUser({ messages, users }: TopEmojisPerUserProps) {
  const [userEmojiData, setUserEmojiData] = React.useState<UserEmojiData[]>([]);

  React.useEffect(() => {
    const emojiCounts: Record<string, Record<string, number>> = {};

    // Broad emoji regex (includes surrogate pairs and symbols)
    const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

    messages.forEach((message) => {
      const user = message.author;
      const content = message.content ?? message.message ?? "";

      const emojisInMessage = content.match(emojiRegex) || [];

      if (emojisInMessage.length > 0) {
        if (!emojiCounts[user]) emojiCounts[user] = {};
        emojisInMessage.forEach((emoji) => {
          emojiCounts[user][emoji] = (emojiCounts[user][emoji] || 0) + 1;
        });
      }
    });

    const newUserEmojiData: UserEmojiData[] = users
      .map((user) => {
        const emojiData = Object.entries(emojiCounts[user] || {})
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        return { user, emojiData };
      })
      .filter((userData) => userData.emojiData.length > 0);

    setUserEmojiData(newUserEmojiData);
  }, [messages, users]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Top Emojis Per User</CardTitle>
        <CardDescription>
          Emoji usage per user in the selected date range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
          {userEmojiData.length === 0 ? (
            <div className="text-muted-foreground text-center">
              No emoji data available.
            </div>
          ) : (
            userEmojiData.map(({ user, emojiData }) => (
              <div key={user} className="space-y-2">
                <h3 className="text-lg font-semibold">{user}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={emojiData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
 `${(percent * 100).toFixed(0)}%`}
                    >
                      {emojiData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${(index * 47) % 360}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
 <Tooltip formatter={(value: number, name: string) => [`Count: ${value}`, `Emoji: ${name}`]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      wrapperStyle={{ zIndex: 1000 }}
                      contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
                      formatter={(value: number, name: string) => [`${value}`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="border-b border-border pt-4" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
