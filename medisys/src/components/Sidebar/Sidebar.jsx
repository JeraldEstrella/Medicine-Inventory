import './Sidebar.css';
import { useApp } from '../../context/AppContext';

const NAV_MAIN = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'inventory', icon: '📦', label: 'Inventory', badgeKey: 'lowStock' },
  { id: 'dispense', icon: '💉', label: 'Dispense' },
  { id: 'history', icon: '📋', label: 'History' },
];

const NAV_INTELLIGENCE = [{ id: 'ai', icon: '🤖', label: 'AI Advisor' }];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentPage, medicines, apiKey } = state;

  const lowStockCount = medicines.filter((m) => m.qty < m.minStock).length;

  function navigate(page) {
    dispatch({ type: 'SET_PAGE', payload: page });
  }

  function checkApiKey(e) {
    dispatch({ type: 'SET_API_KEY', payload: e.target.value });
  }

  const apiOk = apiKey.startsWith('sk-ant-');
  const apiWarn = !apiOk && apiKey.length > 5;

  return (
    <aside className='sidebar'>
      {/* Logo */}
      <div className='sidebar-logo'>
        <div className='logo-mark'>
          <div className='logo-icon'>💊</div>
          <span className='logo-name'>MediSys</span>
        </div>
        <div className='logo-sub'>PH HEALTH CENTER v1.0</div>
      </div>

      {/* Main nav */}
      <div className='nav-section'>
        <div className='nav-label'>Main</div>
        {NAV_MAIN.map((item) => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className='nav-icon'>{item.icon}</span>
            {item.label}
            {item.badgeKey === 'lowStock' && lowStockCount > 0 && (
              <span className='nav-badge'>{lowStockCount}</span>
            )}
          </div>
        ))}
      </div>

      {/* Intelligence nav */}
      <div className='nav-section'>
        <div className='nav-label'>Intelligence</div>
        {NAV_INTELLIGENCE.map((item) => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className='nav-icon'>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </aside>
  );
}
