import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import DownloadButton from "./download-button";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Download Portfolio
            </CardTitle>
            <CardDescription>
              Access your professional portfolio and download it for offline viewing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Thank you for signing in! You now have access to download my professional portfolio.
                This includes my latest work, skills, and experience.
              </p>
              
              <DownloadButton />
              
              <div className="text-sm text-muted-foreground">
                <p>• High-quality PDF format</p>
                <p>• Includes all projects and experience</p>
                <p>• Ready for printing or digital sharing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 