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

interface MessageHeatmapProps {
  messages: ChatMessage[];
}

export function MessageHeatmap({ messages }: MessageHeatmapProps) {
  const [heatmapData, setHeatmapData] = React.useState<number[][]>(
    Array.from({ length: 7 }, () => Array(24).fill(0))
  );

  React.useEffect(() => {
    const newHeatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));

    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dayOfWeek = date.getDay(); // 0 (Sunday) - 6 (Saturday)
      const hour = date.getHours();    // 0 - 23
      newHeatmapData[dayOfWeek][hour]++;
    });

    setHeatmapData(newHeatmapData);
  }, [messages]);

  const flatData = heatmapData.flat();
  const maxMessages = Math.max(...flatData);

  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Message Heatmap</CardTitle>
        <CardDescription>
          Hourly message distribution per weekday.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="mx-auto"
            className="grid grid-cols-[auto_repeat(24,_2rem)] gap-[2px] min-w-[52rem] text-xs justify-items-center"
          >
            {/* Top-left corner empty cell */}
            <div></div>

            {/* Hour labels */}
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={`hour-${i}`}
                className="text-center font-semibold w-8"
              >
                {i.toString().padStart(2, "0")}
              </div>
            ))}

            {/* Rows for each day */}
            {days.map((day, dayIndex) => (
              <React.Fragment key={day}>
                {/* Day label */}
                <div className="pr-2 flex items-center justify-end font-semibold">
                  {day}
                </div>

                {/* Heatmap cells */}
                {Array.from({ length: 24 }, (_, hour) => {
                  const count = heatmapData[dayIndex][hour];
                  const intensity = maxMessages > 0 ? count / maxMessages : 0;
                  const backgroundColor = `rgba(255, 0, 0, ${intensity})`;

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="h-5 w-8 rounded-sm"
                      style={{ backgroundColor }}
                      title={`${day} ${hour.toString().padStart(2, "0")}:00 — ${count} messages`}
                    ></div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Color Legend */}
          <div className="p-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span className="w-4 h-4 rounded-sm bg-[rgba(255,0,0,0.1)]"></span> Low
            <span className="w-4 h-4 rounded-sm bg-[rgba(255,0,0,0.6)]"></span> Medium
            <span className="w-4 h-4 rounded-sm bg-[rgba(255,0,0,1)]"></span> High
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
