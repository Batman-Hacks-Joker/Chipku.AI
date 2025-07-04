"use client"

import * as React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import type { ChatMessage } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface MessagesPerUserChartProps {
  messages: ChatMessage[]
  users: string[]
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function MessagesPerUserChart({ messages, users }: MessagesPerUserChartProps) {
  const data = React.useMemo(() => {
    const userMessageCounts = users.reduce((acc, user) => {
      acc[user] = 0
      return acc
    }, {} as Record<string, number>)

    messages.forEach(message => {
      if (userMessageCounts.hasOwnProperty(message.author)) {
        userMessageCounts[message.author]++
      }
    })

    return Object.entries(userMessageCounts).map(([name, value]) => ({ name, value }))
  }, [messages, users])

  if (!data || data.every(d => d.value === 0)) {
     return (
        <div>
            <CardHeader>
                <CardTitle className="font-headline">Messages Per User</CardTitle>
                <CardDescription>Distribution of messages sent by each person.</CardDescription>
            </CardHeader>
            <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">
                No messages in this date range.
            </div>
        </div>
     )
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline">Messages Per User</CardTitle>
        <CardDescription>Distribution of messages sent by each person.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                cursor={false}
                contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                }}
                />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        if (percent < 0.05) return null;
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor="middle" dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        );
                    }}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
         <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
      </CardContent>
    </>
  )
}
