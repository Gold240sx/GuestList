import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Michael Martell's LinkHub - Professional Networking",
  description: "Connect with professionals and build your network",
  icons: [{ rel: "icon", url: "/public/favicon.ico" }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
		<ClerkProvider
			appearance={{
				baseTheme: undefined,
				variables: {
					colorPrimary: "hsl(var(--primary))",
					colorBackground: "hsl(var(--background))",
					colorInputBackground: "hsl(var(--background))",
					colorInputText: "hsl(var(--foreground))",
				},
				elements: {
					formButtonPrimary:
						"bg-primary hover:bg-primary/90 text-primary-foreground",
					card: "bg-card border border-border shadow-lg",
					headerTitle: "text-foreground",
					headerSubtitle: "text-muted-foreground",
				},
			}}>
			<html lang="en" className="dark">
				<body
					className={`font-sans antialiased ${geistSans.variable} ${geistMono.variable}`}>
					<div className="topography-bg h-screen w-screen fixed inset-0" />
					<NextSSRPlugin
						/**
						 * The `extractRouterConfig` will extract **only** the route configs
						 * from the router to prevent additional information from being
						 * leaked to the client. The data passed to the client is the same
						 * as if you were to fetch `/api/uploadthing` directly.
						 */
						routerConfig={extractRouterConfig(ourFileRouter)}
					/>
					<TRPCReactProvider>
						{props.children}
						<Toaster />
					</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
  )
}
