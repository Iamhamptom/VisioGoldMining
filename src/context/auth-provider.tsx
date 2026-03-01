'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface WorkspaceMembership {
  id: string;
  name: string;
  slug?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  workspaces: WorkspaceMembership[];
  currentWorkspace: { id: string; role: string } | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    workspaces: [],
    currentWorkspace: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('vg_token');
    const userData = localStorage.getItem('vg_user');
    const workspaces = localStorage.getItem('vg_workspaces');
    const currentWs = localStorage.getItem('vg_current_workspace');

    if (token && userData) {
      setState({
        token,
        user: JSON.parse(userData),
        workspaces: workspaces ? JSON.parse(workspaces) : [],
        currentWorkspace: currentWs ? JSON.parse(currentWs) : null,
        isLoading: false,
      });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();
    localStorage.setItem('vg_token', data.token);
    localStorage.setItem('vg_user', JSON.stringify(data.user));
    localStorage.setItem('vg_workspaces', JSON.stringify(data.workspaces));
    localStorage.setItem('vg_current_workspace', JSON.stringify(data.currentWorkspace));

    setState({
      token: data.token,
      user: data.user,
      workspaces: data.workspaces,
      currentWorkspace: data.currentWorkspace,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vg_token');
    localStorage.removeItem('vg_user');
    localStorage.removeItem('vg_workspaces');
    localStorage.removeItem('vg_current_workspace');
    setState({
      token: null,
      user: null,
      workspaces: [],
      currentWorkspace: null,
      isLoading: false,
    });
  }, []);

  const switchWorkspace = useCallback((workspaceId: string) => {
    const ws = state.workspaces.find((w) => w.id === workspaceId);
    if (ws) {
      const currentWs = { id: ws.id, role: ws.role };
      localStorage.setItem('vg_current_workspace', JSON.stringify(currentWs));
      setState((s) => ({ ...s, currentWorkspace: currentWs }));
    }
  }, [state.workspaces]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchWorkspace }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
