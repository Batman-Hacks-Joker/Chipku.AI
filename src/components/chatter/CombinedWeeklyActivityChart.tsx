
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

const COLORS = ["#82ca9d", "#3b82f6", "#ec4899", "#ff8042", "#f59e0b", "#A629D3"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CombinedWeeklyActivityChartProps {
  messages1: ChatMessage[];
  fileName1: string;
  messages2: ChatMessage[];
  fileName2: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const filteredPayload = payload.filter((p: any) => p.value > 0);
        if (filteredPayload.length === 0) return null;

        return (
            <div className="p-1.5 bg-background border rounded-md shadow-lg text-xs">
                <p className="font-bold mb-1">{label}</p>
                <ul className="space-y-0.5">
                    {filteredPayload.map((entry: any, index: number) => (
                        <li key={`item-${index}`} style={{ color: entry.color }}>
                           ● {`${entry.name}: ${entry.value}`}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return null;
};


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
      
      let usersForLegend = [...topUsers];
      if (hasMoreThan5Users) {
        usersForLegend.push('Others');
      }

      const reorderUsers = (users: string[]) => {
        const others = users.find(u => u === 'Others');
        const otherUsers = users.filter(u => u !== 'Others');
        return others ? [...otherUsers, others] : otherUsers;
      };

      return { usersForLegend: reorderUsers(usersForLegend), weeklyData: weeklyDataByUser };
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

    return {
        combined,
        users1: data1.usersForLegend,
        users2: data2.usersForLegend,
    };
  }, [messages1, messages2, chatName1, chatName2]);
  
  const getColor = (userName: string, userList: string[]) => {
      if (userName === 'Others') {
          return COLORS[5];
      }
      const userIndex = userList.filter(u => u !== 'Others').indexOf(userName);
      return COLORS[userIndex % 5];
  };

  const renderLegend = () => {
    return (
      <div className="flex justify-center mt-4 text-xs gap-x-8">
        <div className="flex flex-col space-y-1">
          <h4 className="font-bold mb-1">{chatName1}</h4>
          {chartData.users1.map((user) => (
            <div key={`${chatName1}-${user}`} className="flex items-center">
              <span className="w-2.5 h-2.5 mr-2" style={{ backgroundColor: getColor(user, chartData.users1) }}></span>
              <span>{user}</span>
            </div>
          ))}
        </div> {/* hi*/ }
        <div className="flex flex-col space-y-1">
          <h4 className="font-bold mb-1">{chatName2}</h4>
          {chartData.users2.map((user) => (
            <div key={`${chatName2}-${user}`} className="flex items-center">
              <span className="w-2.5 h-2.5 mr-2" style={{ backgroundColor: getColor(user, chartData.users2) }}></span>
              <span>{user}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <Card className="dark:bg-transparent">
      <CardHeader>
        <CardTitle>Combined Weekly Activity</CardTitle>
        <CardDescription>Aggregated messages by day of the week for top 5 users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto h-[500px]">
            <ResponsiveContainer width="100%" height={500} minWidth={500}>
              <BarChart data={chartData.combined} barGap={4} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Legend content={renderLegend} wrapperStyle={{paddingTop: "20px"}}/>
                {chartData.users1.map((user) => (
                  <Bar 
                    key={`${chatName1}-${user}`} 
                    dataKey={`${chatName1}-${user}`} 
                    stackId="a" 
                    fill={getColor(user, chartData.users1)}
                    name={`${user} (${chatName1})`} 
                  />
                ))}
                {chartData.users2.map((user) => (
                  <Bar 
                    key={`${chatName2}-${user}`} 
                    dataKey={`${chatName2}-${user}`} 
                    stackId="b" 
                    fill={getColor(user, chartData.users2)}
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
