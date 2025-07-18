"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadButton() {
  const handleDownload = () => {
    // Replace this with your actual portfolio file URL
    const portfolioUrl = "/portfolio.pdf"; // You'll need to add this file to public/
    const link = document.createElement("a");
    link.href = portfolioUrl;
    link.download = "Michael-Martell-Portfolio.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={handleDownload}
      className="w-full"
      size="lg"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Portfolio (PDF)
    </Button>
  );
} 