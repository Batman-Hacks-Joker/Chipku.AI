
"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChipkuLoversCount, incrementChipkuLoversCount } from '@/services/chipku-lovers-service';
import { cn } from '@/lib/utils';

const ChipkuLoversCounter: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const hasClicked = localStorage.getItem('hasLoved') === 'true';
        setIsClicked(hasClicked);

        const fetchCount = async () => {
            setIsLoading(true);
            const initialCount = await getChipkuLoversCount();
            setCount(initialCount);
            setIsLoading(false);
        };
        fetchCount();
    }, []);

    const handleClick = async () => {
        if (!isClicked) {
            setIsClicked(true);
            localStorage.setItem('hasLoved', 'true');
            const newCount = await incrementChipkuLoversCount();
            setCount(newCount);
        }
    };

    return (
        <Card className="w-fit p-1">
            <CardHeader className="flex flex-row items-center justify-center p-0 pb-0.5">
                <CardTitle className="text-xs font-medium">Chipku Lovers</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex items-center justify-center space-x-1">
                <button onClick={handleClick} disabled={isClicked} className="disabled:cursor-not-allowed">
                    <Heart className={cn(
                        "h-4 w-4 text-primary transition-all",
                        isClicked ? "fill-primary" : "fill-transparent",
                        !isClicked && "hover:fill-primary/50"
                    )} />
                </button>
                {isLoading ? (
                    <div className="h-5 w-10 bg-muted animate-pulse rounded-md" />
                ) : (
                    <div className="text-base font-bold">
                        {count !== null ? count.toLocaleString() : '...'}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ChipkuLoversCounter;
