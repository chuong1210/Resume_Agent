'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FileText, Upload, User, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'My CVs', icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        fullName: payload.unique_name || payload.name || 'User',
        email: payload.email || '',
      });
    } catch {
      // ignore decode errors
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-bold text-lg text-primary">
            CV Builder AI
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User size={12} />
              {user.fullName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
