'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { FolderGit2, Shield, LogOut } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold">VisioGold DRC</h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>

        <div className="p-4">
          <WorkspaceSwitcher />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/repos">
            <Button variant="ghost" className="w-full justify-start">
              <FolderGit2 className="mr-2 h-4 w-4" />
              Repositories
            </Button>
          </Link>
          <Link href="/audit">
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Audit Log
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => { logout(); router.push('/login'); }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
