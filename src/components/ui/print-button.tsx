"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

export function PrintButton({ downloadUrl }: { downloadUrl?: string }) {
  if (downloadUrl) {
    return (
      <a href={downloadUrl} target="_blank" rel="noreferrer" className="block w-full">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </a>
    );
  }

  return (
    <Button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl"
      onClick={() => window.print()}
    >
      <Printer className="mr-2 h-4 w-4" /> Print
    </Button>
  );
}
