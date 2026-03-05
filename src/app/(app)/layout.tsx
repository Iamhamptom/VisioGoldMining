'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { FolderGit2, Shield, LogOut, Compass, LayoutDashboard, Landmark, Pickaxe, TrendingUp, BriefcaseBusiness } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-gray-500 font-display tracking-widest">Loading...</p>
      </div>
    );
  }

  // Explorer gets full viewport — no sidebar wrapper
  if (pathname === '/explorer') {
    return <>{children}</>;
  }

  // Management pages get dark-themed sidebar layout
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/80 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-display font-bold text-gold-400 tracking-wider">VisioGold DRC</h1>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>

        <div className="p-4">
          <WorkspaceSwitcher />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/explorer">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gold-400 hover:bg-gold-400/10">
              <Compass className="mr-2 h-4 w-4" />
              Explorer
            </Button>
          </Link>
          <Link href="/repos">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5">
              <FolderGit2 className="mr-2 h-4 w-4" />
              Repositories
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gold-400 hover:bg-gold-400/10">
              <Pickaxe className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
          <Link href="/workspaces">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Workspaces
            </Button>
          </Link>
          <Link href="/audit">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5">
              <Shield className="mr-2 h-4 w-4" />
              Audit Log
            </Button>
          </Link>
          <Link href="/dashboard/gov">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gold-400 hover:bg-gold-400/10">
              <Landmark className="mr-2 h-4 w-4" />
              Gov Portal
            </Button>
          </Link>
          <Link href="/dashboard/exploration">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gold-400 hover:bg-gold-400/10">
              <TrendingUp className="mr-2 h-4 w-4" />
              Exploration
            </Button>
          </Link>
          <Link href="/sales/leads">
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gold-400 hover:bg-gold-400/10">
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              Sales
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-white hover:bg-white/5"
            onClick={() => { logout(); router.push('/login'); }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 bg-black text-white">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
