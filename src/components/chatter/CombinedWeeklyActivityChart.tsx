
"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChatMessage } from '@/lib/types';

const COLORS = ["#82ca9d", "#3b82f6", "#ec4899", "#ff8042", "#ffc658", "#8884d8"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CombinedWeeklyActivityChartProps {
  messages1: ChatMessage[];
  fileName1: string;
  messages2: ChatMessage[];
  fileName2: string;
}

const CombinedWeeklyActivityChart: React.FC<CombinedWeeklyActivityChartProps> = ({
  messages1,
  fileName1,
  messages2,
  fileName2,
}) => {
  const getChatName = (fileName: string) => fileName.replace('WhatsApp Chat with ', '').replace('.txt', '');
  const chatName1 = getChatName(fileName1);
  const chatName2 = getChatName(fileName2);

  const chartData = useMemo(() => {
    const processChatData = (messages: ChatMessage[]) => {
      const userMessageCounts = messages.reduce((acc, msg) => {
        acc[msg.author] = (acc[msg.author] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedUsers = Object.entries(userMessageCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([user]) => user);
      
      const hasMoreThan5Users = sortedUsers.length > 5;
      const topUsers = sortedUsers.slice(0, 5);
      
      const weeklyDataByUser: Record<string, number[]> = topUsers.reduce((acc, user) => {
        acc[user] = Array(7).fill(0);
        return acc;
      }, {} as Record<string, number[]>);

      if (hasMoreThan5Users) {
        weeklyDataByUser['Others'] = Array(7).fill(0);
      }

      messages.forEach((msg) => {
        const day = new Date(msg.timestamp).getDay();
        const author = topUsers.includes(msg.author) ? msg.author : 'Others';
        if (weeklyDataByUser[author]) {
            weeklyDataByUser[author][day]++;
        }
      });
      
      const usersForLegend = [...topUsers];
      if (hasMoreThan5Users) {
        {/* say hi to file change */}
        usersForLegend.push('Others');
      }

      return { usersForLegend, weeklyData: weeklyDataByUser };
    };

    const data1 = processChatData(messages1);
    const data2 = processChatData(messages2);
    
    const combined = WEEKDAYS.map((day, index) => {
        const dayData: Record<string, any> = { name: day };
        
        data1.usersForLegend.forEach(user => {
            dayData[`${chatName1}-${user}`] = data1.weeklyData[user] ? data1.weeklyData[user][index] : 0;
        });

        data2.usersForLegend.forEach(user => {
            dayData[`${chatName2}-${user}`] = data2.weeklyData[user] ? data2.weeklyData[user][index] : 0;
        });
        
        return dayData;
    });
    
    const reorderUsers = (users: string[]) => {
      const others = users.find(u => u === 'Others');
      const otherUsers = users.filter(u => u !== 'Others');
      return others ? [others, ...otherUsers] : otherUsers;
    };


    return {
        combined,
        users1: reorderUsers(data1.usersForLegend),
        users2: reorderUsers(data2.usersForLegend),
    };
  }, [messages1, messages2, chatName1, chatName2]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combined Weekly Activity</CardTitle>
        <CardDescription>Aggregated messages by day of the week for top 5 users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto h-[500px]">
            <ResponsiveContainer width="100%" height={500} minWidth={500}>
              <BarChart data={chartData.combined} barGap={10} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chartData.users1.map((user, i) => (
                  <Bar 
                    key={`${chatName1}-${user}`} 
                    dataKey={`${chatName1}-${user}`} 
                    stackId="a" 
                    fill={COLORS[i % COLORS.length]} 
                    name={`${user} (${chatName1})`} 
                  />
                ))}
                {chartData.users2.map((user, i) => (
                  <Bar 
                    key={`${chatName2}-${user}`} 
                    dataKey={`${chatName2}-${user}`} 
                    stackId="b" 
                    fill={COLORS[i % COLORS.length]} 
                    name={`${user} (${chatName2})`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedWeeklyActivityChart;

    