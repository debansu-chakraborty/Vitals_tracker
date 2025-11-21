// Mock API client for demo purposes
// In production, replace with real API calls to FastAPI backend

export interface VitalsEntry {
  id: number;
  user_id: string;
  timestamp: string;
  heart_rate: number | null;
  hr_variability: number | null;
  systolic: number | null;
  diastolic: number | null;
  spo2: number | null;
  steps: number | null;
  sleep_hours: number | null;
  glucose: number | null;
  notes: string | null;
  risk_score: number | null;
}

// Simulated ML risk prediction
function calculateRiskScore(entry: Partial<VitalsEntry>): number {
  let riskFactors = 0;
  let totalFactors = 0;

  if (entry.heart_rate !== null && entry.heart_rate !== undefined) {
    totalFactors++;
    if (entry.heart_rate > 100 || entry.heart_rate < 60) riskFactors += 1;
    if (entry.heart_rate > 120) riskFactors += 0.5;
  }

  if (entry.hr_variability !== null && entry.hr_variability !== undefined) {
    totalFactors++;
    if (entry.hr_variability < 30) riskFactors += 1;
  }

  if (entry.systolic !== null && entry.systolic !== undefined) {
    totalFactors++;
    if (entry.systolic > 130) riskFactors += 1;
    if (entry.systolic > 140) riskFactors += 0.5;
  }

  if (entry.diastolic !== null && entry.diastolic !== undefined) {
    totalFactors++;
    if (entry.diastolic > 85) riskFactors += 1;
  }

  if (entry.spo2 !== null && entry.spo2 !== undefined) {
    totalFactors++;
    if (entry.spo2 < 95) riskFactors += 1;
    if (entry.spo2 < 90) riskFactors += 1;
  }

  if (entry.steps !== null && entry.steps !== undefined) {
    totalFactors++;
    if (entry.steps < 5000) riskFactors += 0.5;
  }

  if (entry.sleep_hours !== null && entry.sleep_hours !== undefined) {
    totalFactors++;
    if (entry.sleep_hours < 6 || entry.sleep_hours > 9) riskFactors += 0.5;
  }

  if (entry.glucose !== null && entry.glucose !== undefined) {
    totalFactors++;
    if (entry.glucose > 100) riskFactors += 0.5;
    if (entry.glucose > 125) riskFactors += 1;
  }

  return totalFactors > 0 ? Math.min(riskFactors / totalFactors, 1) : 0;
}

// Local storage key
const STORAGE_KEY = 'vitals_tracker_data';

// Get stored entries
function getStoredEntries(): VitalsEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save entries
function saveEntries(entries: VitalsEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Initialize with sample data if empty
function initializeSampleData(): void {
  const existing = getStoredEntries();
  if (existing.length === 0) {
    const sampleData: VitalsEntry[] = [
      {
        id: 1,
        user_id: 'demo_user',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        heart_rate: 72,
        hr_variability: 45,
        systolic: 118,
        diastolic: 76,
        spo2: 98,
        steps: 8500,
        sleep_hours: 7.5,
        glucose: 92,
        notes: 'Feeling good',
        risk_score: 0.15
      },
      {
        id: 2,
        user_id: 'demo_user',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        heart_rate: 68,
        hr_variability: 50,
        systolic: 115,
        diastolic: 74,
        spo2: 99,
        steps: 10200,
        sleep_hours: 8,
        glucose: 88,
        notes: null,
        risk_score: 0.08
      },
      {
        id: 3,
        user_id: 'demo_user',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        heart_rate: 88,
        hr_variability: 28,
        systolic: 138,
        diastolic: 88,
        spo2: 96,
        steps: 3200,
        sleep_hours: 5.5,
        glucose: 115,
        notes: 'Stressful day at work',
        risk_score: 0.72
      },
      {
        id: 4,
        user_id: 'demo_user',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        heart_rate: 75,
        hr_variability: 38,
        systolic: 122,
        diastolic: 80,
        spo2: 97,
        steps: 7800,
        sleep_hours: 7,
        glucose: 95,
        notes: null,
        risk_score: 0.22
      },
      {
        id: 5,
        user_id: 'demo_user',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        heart_rate: 70,
        hr_variability: 42,
        systolic: 120,
        diastolic: 78,
        spo2: 98,
        steps: 9100,
        sleep_hours: 7.5,
        glucose: 90,
        notes: null,
        risk_score: 0.12
      },
      {
        id: 6,
        user_id: 'demo_user',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        heart_rate: 73,
        hr_variability: 40,
        systolic: 119,
        diastolic: 77,
        spo2: 98,
        steps: 8200,
        sleep_hours: 7,
        glucose: 93,
        notes: null,
        risk_score: 0.18
      }
    ];
    saveEntries(sampleData);
  }
}

// API functions
export const mockApi = {
  postVitals: async (payload: Partial<VitalsEntry>): Promise<VitalsEntry> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const entries = getStoredEntries();
    const newId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
    
    const newEntry: VitalsEntry = {
      id: newId,
      user_id: payload.user_id || 'demo_user',
      timestamp: payload.timestamp || new Date().toISOString(),
      heart_rate: payload.heart_rate ?? null,
      hr_variability: payload.hr_variability ?? null,
      systolic: payload.systolic ?? null,
      diastolic: payload.diastolic ?? null,
      spo2: payload.spo2 ?? null,
      steps: payload.steps ?? null,
      sleep_hours: payload.sleep_hours ?? null,
      glucose: payload.glucose ?? null,
      notes: payload.notes ?? null,
      risk_score: calculateRiskScore(payload)
    };
    
    entries.unshift(newEntry);
    saveEntries(entries);
    
    return newEntry;
  },

  getVitals: async (userId: string): Promise<VitalsEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entries = getStoredEntries();
    return entries.filter(e => e.user_id === userId);
  },

  getHealthScore: async (userId: string): Promise<{ health_score: number | null }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entries = getStoredEntries();
    const userEntries = entries
      .filter(e => e.user_id === userId)
      .slice(0, 7);
    
    const scores = userEntries
      .map(e => e.risk_score)
      .filter((s): s is number => s !== null);
    
    if (scores.length === 0) {
      return { health_score: null };
    }
    
    const avgRisk = scores.reduce((a, b) => a + b, 0) / scores.length;
    const healthScore = (1 - avgRisk) * 100;
    
    return { health_score: healthScore };
  }
};

// Initialize sample data on import
initializeSampleData();
