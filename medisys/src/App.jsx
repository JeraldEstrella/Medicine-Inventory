import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import { useToast } from './hooks/useToast';

import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import ToastContainer from './components/ToastContainer/ToastContainer';

import Dashboard from './pages/Dashboard/Dashboard';
import Inventory from './pages/Inventory/Inventory';
import Dispense from './pages/Dispense/Dispense';
import History from './pages/History/History';
import AiAdvisor from './pages/AiAdvisor/AiAdvisor';

function AppShell() {
  const { state } = useApp();
  const { toasts, toast } = useToast();

  const page = state.currentPage;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <div
        style={{
          marginLeft: 230,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Topbar />

        <div style={{ padding: '1.6rem 1.8rem', flex: 1 }}>
          {page === 'dashboard' && <Dashboard />}
          {page === 'inventory' && <Inventory toast={toast} />}
          {page === 'dispense' && <Dispense toast={toast} />}
          {page === 'history' && <History toast={toast} />}
          {page === 'ai' && <AiAdvisor toast={toast} />}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
