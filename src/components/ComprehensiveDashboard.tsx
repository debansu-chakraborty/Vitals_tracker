import { useState, useEffect } from 'react';
import { getStoredHealthData, generateAIInsights, DailyHealthData, HealthInsight } from '../lib/healthData';
import { VitalsOverview } from './dashboard/VitalsOverview';
import { MetabolicPanel } from './dashboard/MetabolicPanel';
import { SleepAnalytics } from './dashboard/SleepAnalytics';
import { LifestyleMetrics } from './dashboard/LifestyleMetrics';
import { ActivityMetrics } from './dashboard/ActivityMetrics';
import { RiskPanel } from './dashboard/RiskPanel';
import { TrendsChart } from './dashboard/TrendsChart';
import { AIInsights } from './dashboard/AIInsights';
import { Button } from './ui/button';
import { RefreshCw, Calendar } from 'lucide-react';

export function ComprehensiveDashboard() {
  const [healthData, setHealthData] = useState<DailyHealthData[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getStoredHealthData();
    setHealthData(data);
    setInsights(generateAIInsights(data));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadData();
      setIsRefreshing(false);
    }, 500);
  };

  if (healthData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="size-8 mx-auto mb-4 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Loading health data...</p>
        </div>
      </div>
    );
  }

  const latestData = healthData[healthData.length - 1];
  const previousData = healthData.length > 1 ? healthData[healthData.length - 2] : undefined;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            Last updated: {new Date(latestData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Advanced Vitals Overview */}
      <VitalsOverview currentData={latestData} previousData={previousData} />

      {/* Primary Health Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SleepAnalytics data={latestData.sleep} />
        <ActivityMetrics data={latestData.activity} />
        <RiskPanel data={latestData.risk} />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LifestyleMetrics data={latestData.lifestyle} />
        <MetabolicPanel data={latestData.metabolic} />
      </div>

      {/* AI Insights */}
      <AIInsights insights={insights} />

      {/* Trends and Analytics */}
      <TrendsChart data={healthData} />
    </div>
  );
}
