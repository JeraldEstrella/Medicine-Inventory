import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  medicines: [],
  dispenseLogs: [],
  apiKey: '',
  currentPage: 'dashboard',
  loading: true,
  error: null,
};

// ─── Reducer ───────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };

    case 'SET_MEDICINES':
      return { ...state, medicines: action.payload, loading: false };

    case 'ADD_MEDICINE':
      return {
        ...state,
        medicines: [...state.medicines, action.payload],
      };

    case 'UPDATE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.map((m) =>
          m._id === action.payload._id ? action.payload : m
        ),
      };

    case 'DELETE_MEDICINE':
      return {
        ...state,
        medicines: state.medicines.filter((m) => m._id !== action.payload),
      };

    case 'DISPENSE': {
      const { medicineId, qty, to, by, notes } = action.payload;
      const medicine = state.medicines.find((m) => m._id === medicineId);
      if (!medicine) return state;
      const log = {
        id: Date.now(),
        date: new Date().toISOString(),
        medicineId,
        medicineName: medicine.name,
        qty,
        to,
        by,
        notes,
      };
      return {
        ...state,
        medicines: state.medicines.map((m) =>
          m._id === medicineId ? { ...m, qty: m.qty - qty } : m
        ),
        dispenseLogs: [...state.dispenseLogs, log],
      };
    }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_DISPENSE_LOGS':
      return { ...state, dispenseLogs: action.payload };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ─── FETCH MEDICINES ON MOUNT ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchMedicines() {
      try {
        const response = await fetch(
          'https://medisys-backend.onrender.com/api/medicines'
        );
        const data = await response.json();

        if (data.success && data.data) {
          dispatch({
            type: 'SET_MEDICINES',
            payload: data.data,
          });
        } else {
          throw new Error(data.error || 'Failed to fetch medicines');
        }
      } catch (err) {
        console.error('[FETCH MEDICINES ERROR]', err);
        dispatch({
          type: 'SET_ERROR',
          payload: err.message,
        });
      }
    }

    fetchMedicines();
  }, []);

  // ─── FETCH DISPENSES ON MOUNT ──────────────────────────────────────────────
  useEffect(() => {
    async function fetchDispenses() {
      try {
        const response = await fetch(
          'https://medisys-backend.onrender.com/api/dispense'
        );
        const data = await response.json();
        if (data.success && data.data) {
          dispatch({
            type: 'SET_DISPENSE_LOGS',
            payload: data.data,
          });
        }
      } catch (err) {
        console.error('[FETCH DISPENSES ERROR]', err);
      }
    }

    fetchDispenses();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
