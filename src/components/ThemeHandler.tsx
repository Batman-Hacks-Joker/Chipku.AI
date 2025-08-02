"use client"
import { useDarkModeContext } from "@/context/DarkModeContext";
import { useEffect } from "react";

export function ThemeHandler({ children }: { children: React.ReactNode }) {
    const [isDarkMode] = useDarkModeContext();
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
    return <>{children}</>;
}
