import {
  Bell,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Home,
  Lightbulb,
  ListChecks,
  MessageCircle,
  PanelLeft,
  Plus,
  Radio,
  ShoppingCart,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';
import { btnPrimary, iconBtn } from '../ui.js';

// [Icon, isActive]; null = spacer
const NAV = [
  [Home, true],
  [Briefcase],
  [Lightbulb],
  null,
  [Wrench],
  [Radio],
  [CalendarDays],
  null,
  [Trophy],
  [Users],
  [ListChecks],
  [BadgeCheck],
];

export default function Shell({ children, onToggleTheme, onLogout }) {
  return (
    <div className="flex h-screen flex-col bg-bg text-fg">

      <header className="flex h-[54px] flex-none items-center justify-between pr-[18px]">
        <div className="flex items-center gap-3">
          <span className="w-5 text-xl font-bold"></span>
          <PanelLeft size={16} className="text-muted" />
          <h1 className="text-[15px] font-semibold">SKR Trade Desk</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className={iconBtn} aria-label="Notifications">
            <Bell size={15} />
          </button>
          <button className={iconBtn} aria-label="Cart">
            <ShoppingCart size={15} />
          </button>
          <button className={btnPrimary}>
            <Plus size={14} /> New Challenge
          </button>
          <button
            className={`${iconBtn} border-line`}
            aria-label="Toggle theme"
            title="Click: toggle theme · Double-click: sign out"
            onClick={onToggleTheme}
            onDoubleClick={onLogout}
          >
            <UserRound size={15} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="relative flex w-12 flex-none flex-col items-center gap-1 pb-3 pt-[18px]">
          {NAV.map((item, i) => {
            if (!item) return <span key={i} className="h-3" />;
            const [Icon, active] = item;
            return (
              <button
                key={i}
                className={`grid h-7 w-7 place-items-center rounded-md hover:bg-hover hover:text-fg ${
                  active ? 'bg-hover text-fg' : 'text-muted'
                }`}
              >
                <Icon size={15} />
              </button>
            );
          })}
          <Sparkles size={13} className="absolute bottom-3 text-faint" />
        </nav>

        <main className="mr-1 flex-1 overflow-y-auto rounded-xl px-5 pb-7 pt-3.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-track [&::-webkit-scrollbar]:w-1.5">
          {children}
        </main>
      </div>

      <button
        className="fixed bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-[#1a2c8c] text-white shadow-lg"
        aria-label="Support chat"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
}
