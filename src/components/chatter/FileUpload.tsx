"use client"

import * as React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface FileUploadProps {
  onFileProcessed: (content: string, name: string) => void;
}

export function FileUpload({ onFileProcessed }: FileUploadProps) {
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileProcessed(content, file.name);
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a .txt file.",
        })
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
     if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileProcessed(content, file.name);
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a .txt file.",
        })
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <Card 
      className="w-full max-w-lg cursor-pointer border-2 border-dashed border-border hover:border-primary transition-colors duration-300 bg-card/50"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="p-10 flex flex-col items-center justify-center text-center">
        <Upload className="w-12 h-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold font-headline text-foreground">
          Drag & Drop or Click to Upload
        </h3>
        <p className="text-muted-foreground mt-1">
          Upload your exported WhatsApp chat .txt file
        </p>
        <Input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
