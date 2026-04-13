import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import TeamPage from './components/TeamPage';
import TeamMemberPage from './components/TeamMemberPage';
import ChecklistsPage from './components/ChecklistsPage';
import CallsPage from './components/CallsPage';
import { TooltipProvider } from './components/Tooltip';

export default function App() {
  const [activePage,   setActivePage]   = useState('Home');
  const [activeMember, setActiveMember] = useState(null);

  function navigate(page) {
    setActivePage(page);
    setActiveMember(null); // reset member view when navigating pages
  }

  return (
    <TooltipProvider>
    <div className="flex h-screen bg-pale-white overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto">
        <TopNav />
        <main className="flex flex-col flex-1">
          {activePage === 'Home' && <Dashboard onNavigate={navigate} />}
          {activePage === 'Team' && !activeMember && (
            <TeamPage onSelectMember={setActiveMember} />
          )}
          {activePage === 'Team' && activeMember && (
            <TeamMemberPage
              member={activeMember}
              onBack={() => setActiveMember(null)}
            />
          )}
          {activePage === 'Checklists' && <ChecklistsPage />}
          {activePage === 'Calls' && <CallsPage />}
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}
