import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = "Monthly Strategy Sync" }: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col dynamic-bg overflow-x-hidden">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 lg:px-20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
            <BarChart3 size={24} />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">QuizMaster</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-medium text-slate-400">Presenting</span>
            <span className="text-sm font-bold">{title}</span>
          </div>
          <div className="bg-primary/20 p-1 rounded-full border border-primary/30">
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden bg-slate-800 flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
