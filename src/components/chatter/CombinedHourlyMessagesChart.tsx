"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChatMessage } from '@/lib/types';

interface CombinedHourlyMessagesChartProps {
  messages1: ChatMessage[];
  messages2: ChatMessage[];
  users1: string[];
  users2: string[];
}

const CombinedHourlyMessagesChart: React.FC<CombinedHourlyMessagesChartProps> = ({ messages1, messages2, users1, users2 }) => {
  const processData = (messages: ChatMessage[]) => {
    const hourlyData = Array(24).fill(0).map(() => 0);
    messages.forEach((msg) => {
      const hour = new Date(msg.timestamp).getHours();
      hourlyData[hour]++;
    });
    return hourlyData;
  };

  const data1 = processData(messages1);
  const data2 = processData(messages2);

  const combinedData = Array(24).fill(0).map((_, hour) => ({
    hour: `${hour}:00`,
    'Chat 1': data1[hour] || 0,
    'Chat 2': data2[hour] || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combined Hourly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Chat 1" stroke="#8884d8" />
            <Line type="monotone" dataKey="Chat 2" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CombinedHourlyMessagesChart;
