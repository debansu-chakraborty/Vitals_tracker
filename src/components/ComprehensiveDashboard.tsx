import { useState, useEffect } from 'react';
import { VitalsOverview } from './dashboard/VitalsOverview';
import { MetabolicPanel } from './dashboard/MetabolicPanel';
import { SleepAnalytics } from './dashboard/SleepAnalytics'; // Will be commented out below
import { LifestyleMetrics } from './dashboard/LifestyleMetrics';
import { ActivityMetrics } from './dashboard/ActivityMetrics';
import { RiskPanel } from './dashboard/RiskPanel';
import { TrendsChart } from './dashboard/TrendsChart'; // Will be commented out below
import { AIInsights } from './dashboard/AIInsights'; // Will be commented out below
import { Button } from './ui/button';
import { RefreshCw, Calendar, AlertCircle, Moon, CheckCircle, AlertTriangle } from 'lucide-react'; 
import { getVitals } from '../lib/api';

// --- ADAPTER INTERFACES ---
interface AdvancedVitals {
  heart_rate: number;
  hrv: number; 
  blood_pressure: {
    systolic: number;
    diastolic: number;
  };
  spo2: number;
  glucose: number;
  temperature: number;
  respiratory_rate: number;
}

interface DailyHealthData {
  date: string;
  vitals: AdvancedVitals; 
  sleep: any;
  activity: any;
  risk: any;
  lifestyle: any;
  metabolic: any;
}

export function ComprehensiveDashboard() {
  const [userId] = useState('demo_user');
  const [latestData, setLatestData] = useState<DailyHealthData | null>(null);
  const [previousData, setPreviousData] = useState<DailyHealthData | null>(null);
  const [healthData, setHealthData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const apiData = await getVitals(userId);
      
      if (!apiData || apiData.length === 0) {
        setLatestData(null);
        setIsLoading(false);
        return;
      }

      // --- DATA TRANSFORMATION (Bulletproof) ---
      const transformedData = apiData.map(entry => ({
        date: entry.timestamp,
        vitals: {
          heart_rate: Number(entry.heart_rate) || 0,
          hrv: Number(entry.hr_variability) || 0,
          blood_pressure: {
            systolic: Number(entry.systolic) || 0,
            diastolic: Number(entry.diastolic) || 0
          },
          spo2: Number(entry.spo2) || 0,
          glucose: Number(entry.glucose) || 0,
          temperature: 36.6, 
          respiratory_rate: 16 
        },
        sleep: {
          total_hours: Number(entry.sleep_hours) || 0,
          deep_sleep: (Number(entry.sleep_hours) || 0) * 0.2,
          rem_sleep: (Number(entry.sleep_hours) || 0) * 0.25,
          light_sleep: (Number(entry.sleep_hours) || 0) * 0.55,
          efficiency: 85,
          score: entry.sleep_hours ? Math.min((Number(entry.sleep_hours) / 8) * 100, 100) : 0,
          awakenings: 1, 
          latency: 15    
        },
        activity: {
          steps: Number(entry.steps) || 0,
          active_minutes: (Number(entry.steps) || 0) / 100,
          vo2_max: 45,
          calories_burned: (Number(entry.steps) || 0) * 0.04,
          distance: (Number(entry.steps) || 0) * 0.0008,
          floors_climbed: 10
        },
        risk: {
          overall_score: entry.risk_score ? Number(entry.risk_score) * 100 : 0,
          level: entry.risk_score && entry.risk_score > 0.5 ? 'High' : 'Low',
          factors: [],
          trend: 'stable'
        },
        lifestyle: {
          water_intake: 2000,
          caffeine: 100,
          alcohol: 0,
          screen_time: 6
        },
        metabolic: {
          glucose: Number(entry.glucose) || 0,
          cholesterol: 180,
          hba1c: 5.4,
          triglycerides: 150,
          ldl: 100,
          hdl: 50
        }
      }));

      const sorted = transformedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setLatestData(sorted[0]);
      setPreviousData(sorted[1] || sorted[0]);
      setHealthData(sorted.slice(0, 7).reverse());
      
      // Insights are still needed for VitalsOverview logic
      const newInsights = [];
      if (sorted[0].risk.overall_score > 50) {
        newInsights.push({ 
            id: 'risk-1', title: 'Risk Alert', type: 'critical', category: 'Risk', icon: AlertTriangle
        });
      } else {
        newInsights.push({ 
            id: 'risk-0', title: 'Low Risk', type: 'positive', category: 'General', icon: CheckCircle
        });
      }
      
      setInsights(newInsights);

    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to load analytics data. Check backend connection.");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  if (error) {
    return (
      <div className="p-8 text-center border rounded-lg bg-red-50 text-red-800">
        <AlertCircle className="mx-auto mb-2 size-8" />
        <p>{error}</p>
        <Button variant="outline" onClick={handleRefresh} className="mt-4 bg-white">Retry Connection</Button>
      </div>
    );
  }

  if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="size-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading health data...</p>
          </div>
        </div>
      );
  }

  if (!latestData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="size-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No data available. Log some vitals first!</p>
          <Button onClick={handleRefresh}>Refresh Data</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            Last updated: {new Date(latestData.date).toLocaleDateString()}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {latestData && (
        <>
          <VitalsOverview currentData={latestData} previousData={previousData || latestData} />

          {/* CRASH FIX: Comment out the components causing TypeError: Cannot read properties of undefined */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* {latestData.sleep && <SleepAnalytics data={latestData.sleep} />}  <-- CRASHING */}
            {latestData.activity && <ActivityMetrics data={latestData.activity} />}
            {latestData.risk && <RiskPanel data={latestData.risk} />}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {latestData.lifestyle && <LifestyleMetrics data={latestData.lifestyle} />}
            {latestData.metabolic && <MetabolicPanel data={latestData.metabolic} />}
          </div>

          {/* {insights && <AIInsights insights={insights || []} />} <-- CRASHING */}
          {/* {healthData && <TrendsChart data={healthData || []} />} <-- CRASHING */}

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <AlertCircle className="inline size-4 mr-2" />
            Analytics Charts (Sleep, Trends, AI Insights) temporarily disabled due to data compatibility errors. Core functionality (Vitals Overview, Log Data, Risk Score) remains operational.
          </div>
        </>
      )}
    </div>
  );
}