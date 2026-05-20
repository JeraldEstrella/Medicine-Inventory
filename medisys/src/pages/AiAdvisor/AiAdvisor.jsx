import { useState, useRef, useEffect } from 'react';
import './AiAdvisor.css';
import Panel from '../../components/Panel/Panel';
import Button from '../../components/Button/Button';
import { useApp } from '../../context/AppContext';
import { daysUntilExpiry } from '../../utils/helpers';

const QUICK_PROMPTS = [
  {
    key: 'full_analysis',
    icon: '🔍',
    label: 'Full Inventory Analysis',
    text: 'Please perform a comprehensive analysis of our current medicine inventory. Identify critical issues, near-term risks, and overall inventory health. Give actionable insights in a structured format.',
  },
  {
    key: 'shortage_forecast',
    icon: '📉',
    label: 'Shortage Forecast',
    text: 'Based on our current stock levels, minimum thresholds, and recent dispense patterns, forecast which medicines are at risk of stock-out in the next 30-60 days. Prioritize by urgency.',
  },
  {
    key: 'procurement',
    icon: '🛒',
    label: 'Procurement Recommendations',
    text: 'Generate a prioritized procurement recommendation list based on current stock levels, minimum requirements, and expiry dates. Include suggested reorder quantities and urgency levels.',
  },
  {
    key: 'expiry',
    icon: '⏰',
    label: 'Expiry Risk Assessment',
    text: 'Conduct an expiry risk assessment on our current inventory. Identify medicines at risk of expiring soon and recommend actions to minimize waste.',
  },
  {
    key: 'distribution',
    icon: '📦',
    label: 'Distribution Strategy',
    text: 'Analyze our dispensing logs and current stock. Recommend how we should prioritize distribution to ensure equitable access while preventing shortages.',
  },
  {
    key: 'emergency',
    icon: '🚨',
    label: 'Emergency Readiness',
    text: "Assess our inventory's readiness for emergency situations such as disease outbreaks or natural disasters. Identify gaps and recommend what to stockpile.",
  },
];

function buildInventoryContext(medicines, dispenseLogs) {
  const today = new Date();
  const meds = medicines.map((m) => {
    const daysToExpiry = m.expiry ? daysUntilExpiry(m.expiry) : null;
    return {
      name: m.name,
      category: m.category,
      qty: m.qty,
      minStock: m.minStock,
      unit: m.unit,
      expiryDate: m.expiry,
      daysToExpiry,
      isLowStock: m.qty < m.minStock,
      expiringWithin30Days: daysToExpiry !== null && daysToExpiry <= 30,
      supplier: m.supplier,
      unitPrice: m.price,
    };
  });

  const recentLogs = [...dispenseLogs]
    .reverse()
    .slice(0, 10)
    .map((l) => ({
      medicine: l.medicineName,
      qty: l.qty,
      to: l.to,
      date: l.date.slice(0, 10),
    }));
  return `
CURRENT INVENTORY (${medicines.length} medicines):
${JSON.stringify(meds, null, 2)}

RECENT DISPENSE LOGS (last 10):
${JSON.stringify(recentLogs, null, 2)}

Today's date: ${today.toISOString().slice(0, 10)}
Health center type: Philippine Public Health Center / RHU
  `.trim();
}

function TypingIndicator() {
  return (
    <div className='ai-msg'>
      <div className='ai-avatar bot'>🤖</div>
      <div className='ai-bubble bot'>
        <div className='ai-typing'>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default function AiAdvisor({ toast }) {
  const { state } = useApp();
  const { medicines, dispenseLogs } = state;
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  const lowCount = medicines.filter((m) => m.qty < m.minStock).length;
  const expiringCount = medicines.filter(
    (m) => m.expiry && new Date(m.expiry) <= in30
  ).length;
  const totalValue = medicines.reduce((s, m) => s + m.qty * (m.price || 0), 0);

  async function sendToAI(userMessage) {
    const trimmed = userMessage.trim();

    if (!trimmed || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: trimmed,
      },
    ]);

    setLoading(true);

    try {
      const inventoryContext = buildInventoryContext(medicines, dispenseLogs);

      const response = await fetch(
        'https://medicine-inventory-z694.onrender.com/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
            history: messages,
            inventoryContext,
          }),
        }
      );

      const data = await response.json();

      setLoading(false);

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: data.reply,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: '⚠️ ' + (data.error || 'Unknown AI error'),
          },
        ]);
      }
    } catch (err) {
      console.error(err);

      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: '⚠️ Network error. Please try again.',
        },
      ]);
    }
  }

  function handleSend() {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    sendToAI(msg);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div>
      <div className='page-header'>
        <div>
          <div className='page-title'>🤖 AI Inventory Advisor</div>
          <div className='page-sub'>
            Powered by GPT-4o-mini — Demand forecasting, shortage detection,
            procurement recommendations
          </div>
        </div>
      </div>

      <div className='ai-layout'>
        {/* Left column */}
        <div>
          <Panel
            title='📊 Inventory Snapshot'
            bodyStyle={{ fontSize: '.85rem', lineHeight: 1.8 }}
          >
            <div>
              📦 <strong>{medicines.length}</strong> medicines in inventory
            </div>
            <div>
              ⚠️ <strong style={{ color: 'var(--red)' }}>{lowCount}</strong>{' '}
              items with low stock
            </div>
            <div>
              ⏰{' '}
              <strong style={{ color: 'var(--yellow)' }}>
                {expiringCount}
              </strong>{' '}
              items expiring within 30 days
            </div>
            <div>
              💉 <strong>{dispenseLogs.length}</strong> total dispense records
            </div>
            <div>
              💰 Total stock value:{' '}
              <strong>
                ₱
                {totalValue.toLocaleString('en-PH', {
                  minimumFractionDigits: 2,
                })}
              </strong>
            </div>
          </Panel>

          <div style={{ marginTop: '1rem' }}>
            <Panel title='⚡ Quick Analysis'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.5rem',
                }}
              >
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.key}
                    className='ai-option-btn'
                    disabled={loading}
                    onClick={() => sendToAI(p.text)}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Chat area */}
        <div className='ai-chat-area'>
          <div className='ai-chat-messages' ref={chatRef}>
            {!messages.length && (
              <div className='empty-state' style={{ marginTop: '3rem' }}>
                <div className='empty-icon'>🤖</div>
                Ask me anything about your inventory, or use a quick analysis
                above.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <div className={`ai-avatar ${m.role}`}>
                  {m.role === 'bot' ? '🤖' : '👤'}
                </div>
                <div
                  className={`ai-bubble ${m.role}`}
                  dangerouslySetInnerHTML={{
                    __html: m.text.replace(/\n/g, '<br/>'),
                  }}
                />
              </div>
            ))}
            {loading && <TypingIndicator />}
          </div>

          <div className='ai-input-row'>
            <input
              className='ai-input'
              placeholder='Ask about stock, expiry, procurement...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <Button variant='primary' onClick={handleSend} disabled={loading}>
              {loading ? '...' : '➤ Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
