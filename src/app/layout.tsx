import "@/styles/globals.css";

import { Poppins } from "next/font/google";
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: "TaskFlow - Modern Task Management",
  description: "A modern task management app built with Next.js 15",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex min-h-screen flex-col">
                <header className="py-6">
                  <nav className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">TaskFlow</h1>
                    <ModeToggle />
                  </nav>
                </header>
                <main className="flex-1">
                  {children}
                </main>
                <footer className="py-6 text-center text-sm text-muted-foreground">
                  Built with Next.js 15
                </footer>
              </div>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}