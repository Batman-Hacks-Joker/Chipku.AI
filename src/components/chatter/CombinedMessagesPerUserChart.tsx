"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users } from "lucide-react";

import type { ChatMessage } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CombinedMessagesPerUserChartProps {
  messages1: ChatMessage[];
  users1: string[];
  fileName1: string;
  messages2: ChatMessage[];
  users2: string[];
  fileName2: string;
}

const COLORS = [
  "#C21E56", // Deep magenta
  "#A629D3", // Electric purple
  "#3b82f6", // Blue
  "#f59e0b", // Yellow
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.03) { // Do not render labels for small segments
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-gray-800 text-white rounded-md shadow-lg">
        <p className="font-bold">{data.name}</p>
        <p>Messages: {data.value}</p>
        <p>Chat: {data.chatName}</p>
      </div>
    );
  }

  return null;
};

export function CombinedMessagesPerUserChart({
  messages1,
  users1,
  fileName1,
  messages2,
  users2,
  fileName2,
}: CombinedMessagesPerUserChartProps) {
  const getChatName = (fileName: string) => {
    return fileName
      .replace('WhatsApp Chat with ', '')
      .replace('.txt', '');
  };

  const chatName1 = getChatName(fileName1);
  const chatName2 = getChatName(fileName2);

  const processData = (messages: ChatMessage[], users: string[], chatName: string) => {
    const userMessageCounts = users.reduce((acc, user) => {
      acc[user] = 0;
      return acc;
    }, {} as Record<string, number>);

    messages.forEach((message) => {
      if (userMessageCounts.hasOwnProperty(message.author)) {
        userMessageCounts[message.author]++;
      }
    });

    const sortedUsers = Object.entries(userMessageCounts)
      .sort(([, a], [, b]) => b - a);

    if (sortedUsers.length > 5) {
      const top5 = sortedUsers.slice(0, 5);
      const othersCount = sortedUsers.slice(5).reduce((acc, [, count]) => acc + count, 0);
      const top5Data = top5.map(([name, value]) => ({ name, value, chatName }));
      if (othersCount > 0) {
        return [...top5Data, { name: 'Others', value: othersCount, chatName }];
      }
      return top5Data;
    }

    return sortedUsers.map(([name, value]) => ({ name, value, chatName }));
  };

  const data1 = processData(messages1, users1, chatName1);
  const data2 = processData(messages2, users2, chatName2);

  const allUsers = [...new Set([...data1.map(d => d.name), ...data2.map(d => d.name)])];
  const colorMap = allUsers.reduce((acc, user, index) => {
    acc[user] = COLORS[index % COLORS.length];
    return acc;
  }, {} as Record<string, string>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Contribution</CardTitle>
        <CardDescription>
          Comparing message distribution between {chatName1} and {chatName2}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto h-[350px]">
          <ResponsiveContainer width="100%" height={460} minWidth={300}>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Pie
                data={data1}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                paddingAngle={5}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data1.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={colorMap[entry.name]} />
                ))}
              </Pie>
              <Pie
                data={data2}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={120}
                fill="#82ca9d"
                paddingAngle={5}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data2.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={colorMap[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
