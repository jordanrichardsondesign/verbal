import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="flex h-screen bg-pale-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNav />
        <main className="flex flex-1 overflow-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
