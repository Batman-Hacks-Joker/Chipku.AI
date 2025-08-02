"use client";

import { Loader2 } from "lucide-react";

interface LoadingPageProps {
  title: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-headline font-semibold text-primary">{title}</h1>
    </div>
  );
};
