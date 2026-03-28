"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft, BotMessageSquare } from "lucide-react";
import { AiAssistantPanel } from "@/features/ai-assistant/components/ai-assistant-panel";

interface LayoutContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  headerContent: ReactNode;
  setHeaderContent: (content: ReactNode) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  aiContext: { traceId?: string; traceSessionId?: string } | null;
  setAiContext: (context: { traceId?: string; traceSessionId?: string } | null) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  headerContent: null,
  setHeaderContent: () => {},
  aiPanelOpen: false,
  setAiPanelOpen: () => {},
  aiContext: null,
  setAiContext: () => {},
});

export function useLayout() {
  return useContext(LayoutContext);
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiContext, setAiContext] = useState<{ traceId?: string; traceSessionId?: string } | null>(
    null,
  );
  const pathname = usePathname();
  const isProjectPage = /^\/projects\/[^/]+/.test(pathname);
  const isProjectSettingsPage = /^\/projects\/[^/]+\/settings(\/|$)/.test(pathname);
  const showAiButton = isProjectPage && !isProjectSettingsPage;

  // Don't show layout on auth pages
  if (pathname.startsWith("/auth/")) {
    return <>{children}</>;
  }

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        headerContent,
        setHeaderContent,
        aiPanelOpen,
        setAiPanelOpen,
        aiContext,
        setAiContext,
      }}
    >
      <div className="flex h-screen">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Top header bar */}
          <header className="flex h-14 items-center gap-2 border-b bg-background px-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            {headerContent}
            {showAiButton && (
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setAiPanelOpen(!aiPanelOpen)}
                  title="AI Assistant"
                >
                  <BotMessageSquare className="h-4 w-4" />
                </Button>
              </div>
            )}
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
        <AiAssistantPanel
          open={aiPanelOpen}
          initialContext={aiContext}
          onClose={() => {
            setAiPanelOpen(false);
            setAiContext(null);
          }}
        />
      </div>
    </LayoutContext.Provider>
  );
}
