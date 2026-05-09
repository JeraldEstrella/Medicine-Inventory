import { useEffect, useState } from 'react';
import './Topbar.css';
import { useApp } from '../../context/AppContext';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  inventory:  'Medicine Inventory',
  dispense:   'Dispense Medicine',
  history:    'Dispensing History',
  ai:         'AI Inventory Advisor',
};

export default function Topbar() {
  const { state } = useApp();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-PH', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{PAGE_TITLES[state.currentPage] ?? 'MediSys'}</div>
        <div className="topbar-sub">Philippine Public Health Center Management System</div>
      </div>
      <div className="topbar-right">
        <div className="topbar-time">{time}</div>
      </div>
    </div>
  );
}
