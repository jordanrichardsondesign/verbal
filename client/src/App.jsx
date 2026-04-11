import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import TeamPage from './components/TeamPage';
import ChecklistsPage from './components/ChecklistsPage';
import CallsPage from './components/CallsPage';
import { TooltipProvider } from './components/Tooltip';

export default function App() {
  const [activePage, setActivePage] = useState('Home');

  return (
    <TooltipProvider>
    <div className="flex h-screen bg-pale-white overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto">
        <TopNav />
        <main className="flex flex-col flex-1">
          {activePage === 'Home' && <Dashboard />}
          {activePage === 'Team' && <TeamPage />}
          {activePage === 'Checklists' && <ChecklistsPage />}
          {activePage === 'Calls' && <CallsPage />}
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}
