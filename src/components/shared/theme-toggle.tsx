"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      className="btn-lg h-10 px-4"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
