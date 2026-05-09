import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import './Dashboard.css';
import Panel from '../../components/Panel/Panel';
import { useApp } from '../../context/AppContext';
import { fmtDateFull, daysUntilExpiry, todaysLogs } from '../../utils/helpers';

// ─── KPI Card ─────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon, color }) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className='kpi-label'>{label}</div>
      <div className='kpi-value'>{value}</div>
      <div className='kpi-sub'>{sub}</div>
      <div className='kpi-icon'>{icon}</div>
    </div>
  );
}

// ─── Alert list ───────────────────────────────────────────────────────────
function AlertsPanel({ medicines }) {
  const today = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  const alerts = [
    ...medicines
      .filter((m) => m.qty < m.minStock)
      .map((m) => ({
        dot: 'red',
        text: (
          <>
            <strong>{m.name}</strong> — Low stock ({m.qty} {m.unit} / min{' '}
            {m.minStock})
          </>
        ),
        time: 'Stock alert',
        id: `low-${m._id}`,
      })),
    ...medicines
      .filter((m) => m.expiry && new Date(m.expiry) <= in30)
      .map((m) => {
        const d = daysUntilExpiry(m.expiry);
        return {
          dot: 'yellow',
          text: (
            <>
              <strong>{m.name}</strong> — Expires in {d} day{d !== 1 ? 's' : ''}
            </>
          ),
          time: 'Expiry alert',
          id: `expiry-${m._id}`,
        };
      }),
  ];

  if (!alerts.length) {
    return (
      <div className='empty-state'>
        <div className='empty-icon'>✅</div>
        No active alerts
      </div>
    );
  }

  return alerts.map((a, i) => (
    <div className='alert-item' key={a.id}>
      <div className={`alert-dot ${a.dot}`} />
      <div>
        <div className='alert-text'>{a.text}</div>
        <div className='alert-time'>{a.time}</div>
      </div>
    </div>
  ));
}

// ─── Recent dispenses ─────────────────────────────────────────────────────
function RecentDispenses({ logs }) {
  const recent = [...logs].reverse().slice(0, 5);
  if (!recent.length) {
    return (
      <div className='empty-state'>
        <div className='empty-icon'>📋</div>No dispenses yet
      </div>
    );
  }
  return recent.map((l) => (
    <div className='recent-row' key={l._id || l.id}>
      <div>
        <div className='recent-name'>{l.medicineName}</div>
        <div className='recent-meta'>
          {l.to} · {fmtDateFull(l.date)}
        </div>
      </div>
      <span className='pill pill-blue'>{l.qty}</span>
    </div>
  ));
}

// ─── Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { state } = useApp();
  const { medicines, dispenseLogs } = state;

  const stockChartRef = useRef(null);
  const catChartRef = useRef(null);
  const stockChart = useRef(null);
  const catChart = useRef(null);

  const today = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  const adequate = medicines.filter((m) => m.qty >= m.minStock).length;
  const lowStock = medicines.filter((m) => m.qty < m.minStock).length;
  const expiring = medicines.filter(
    (m) => m.expiry && new Date(m.expiry) <= in30
  ).length;
  const alertCount = lowStock + expiring;

  // Stock levels bar chart
  useEffect(() => {
    if (!stockChartRef.current) return;
    if (stockChart.current) stockChart.current.destroy();

    const top8 = [...medicines].sort((a, b) => b.qty - a.qty).slice(0, 8);
    stockChart.current = new Chart(stockChartRef.current, {
      type: 'bar',
      data: {
        labels: top8.map((m) =>
          m.name.length > 16 ? m.name.slice(0, 16) + '…' : m.name
        ),
        datasets: [
          {
            label: 'Current Stock',
            data: top8.map((m) => m.qty),
            backgroundColor: top8.map((m) =>
              m.qty < m.minStock ? 'rgba(245,158,11,.7)' : 'rgba(14,165,233,.7)'
            ),
            borderRadius: 4,
          },
          {
            label: 'Min. Stock',
            data: top8.map((m) => m.minStock),
            backgroundColor: 'rgba(255,255,255,.06)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { labels: { color: '#8b95a3', font: { size: 11 } } },
        },
        scales: {
          x: {
            ticks: { color: '#5a6475', font: { size: 10 } },
            grid: { color: '#21293a' },
          },
          y: {
            ticks: { color: '#5a6475', font: { size: 10 } },
            grid: { color: '#21293a' },
          },
        },
      },
    });
    return () => stockChart.current?.destroy();
  }, [medicines]);

  // Category donut chart
  useEffect(() => {
    if (!catChartRef.current) return;
    if (catChart.current) catChart.current.destroy();

    const cats = {};
    medicines.forEach((m) => {
      cats[m.category] = (cats[m.category] || 0) + m.qty;
    });
    catChart.current = new Chart(catChartRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(cats),
        datasets: [
          {
            data: Object.values(cats),
            backgroundColor: [
              '#f472b6',
              '#818cf8',
              '#34d399',
              '#fb923c',
              '#facc15',
              '#94a3b8',
            ],
            borderWidth: 2,
            borderColor: '#151b23',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#8b95a3', font: { size: 10 }, padding: 12 },
          },
        },
      },
    });
    return () => catChart.current?.destroy();
  }, [medicines]);

  return (
    <div className='dashboard-container'>
      {/* KPI Grid */}
      <div className='kpi-grid'>
        <KpiCard
          label='Total Medicines'
          value={medicines.length}
          sub='items in formulary'
          icon='💊'
          color='blue'
        />
        <KpiCard
          label='Adequate Stock'
          value={adequate}
          sub='items above minimum'
          icon='✅'
          color='green'
        />
        <KpiCard
          label='Low Stock'
          value={lowStock}
          sub='items need restocking'
          icon='⚠️'
          color='yellow'
        />
        <KpiCard
          label='Expiring Soon'
          value={expiring}
          sub='within 30 days'
          icon='⏰'
          color='red'
        />
      </div>

      {/* Charts + Alerts */}
      <div className='dashboard-grid'>
        <Panel
          title='📈 Stock Levels Overview'
          headerRight={<span className='text-sm'>Top 8 medicines</span>}
          wide
          bodyStyle={{ padding: '.5rem' }}
        >
          <canvas ref={stockChartRef} style={{ maxHeight: 220 }} />
        </Panel>

        <Panel
          title='🚨 Active Alerts'
          headerRight={
            alertCount > 0 && (
              <span className='pill pill-red'>{alertCount}</span>
            )
          }
          bodyStyle={{
            maxHeight: 240,
            overflowY: 'auto',
            padding: '.6rem 1rem',
          }}
        >
          <AlertsPanel medicines={medicines} />
        </Panel>
      </div>

      {/* Category + Recent */}
      <div
        className='dashboard-grid'
        style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}
      >
        <Panel title='🗂 Stock by Category' bodyStyle={{ padding: '.5rem' }}>
          <canvas ref={catChartRef} style={{ maxHeight: 220 }} />
        </Panel>

        <Panel
          title='💉 Recent Dispenses'
          bodyStyle={{
            maxHeight: 220,
            overflowY: 'auto',
            padding: '.5rem 1rem',
          }}
        >
          <RecentDispenses logs={dispenseLogs} />
        </Panel>
      </div>
    </div>
  );
}
