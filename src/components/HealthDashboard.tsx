import { useEffect, useState } from 'react';
import { mockApi, VitalsEntry } from '../lib/mockApi';
import { RiskCard } from './RiskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Activity, TrendingUp, TrendingDown, Minus, Heart, AlertTriangle } from 'lucide-react';

interface HealthDashboardProps {
  userId: string;
  refreshTrigger?: number;
}

export function HealthDashboard({ userId, refreshTrigger = 0 }: HealthDashboardProps) {
  const [vitals, setVitals] = useState<VitalsEntry[]>([]);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [vitalsData, scoreData] = await Promise.all([
          mockApi.getVitals(userId),
          mockApi.getHealthScore(userId)
        ]);
        setVitals(vitalsData);
        setHealthScore(scoreData.health_score);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, refreshTrigger]);

  const getHealthScoreLevel = (score: number | null) => {
    if (score === null) return { label: 'No data', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Needs Attention', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const calculateTrend = () => {
    if (vitals.length < 2) return { direction: 'stable', icon: Minus };
    
    const recent = vitals.slice(0, 3).map(v => v.risk_score).filter((s): s is number => s !== null);
    const older = vitals.slice(3, 6).map(v => v.risk_score).filter((s): s is number => s !== null);
    
    if (recent.length === 0 || older.length === 0) return { direction: 'stable', icon: Minus };
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const diff = olderAvg - recentAvg; // Lower risk = better
    
    if (diff > 0.05) return { direction: 'improving', icon: TrendingUp };
    if (diff < -0.05) return { direction: 'declining', icon: TrendingDown };
    return { direction: 'stable', icon: Minus };
  };

  const healthLevel = getHealthScoreLevel(healthScore);
  const trend = calculateTrend();
  const TrendIcon = trend.icon;

  const highRiskCount = vitals.filter(v => v.risk_score !== null && v.risk_score > 0.7).length;
  const hasHighRisk = highRiskCount > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <Activity className="size-6 animate-pulse text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-5" />
            Health Score
          </CardTitle>
          <CardDescription>
            Based on your last 7 vital readings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl ${healthLevel.color}`}>
                {healthScore !== null ? Math.round(healthScore) : '—'}
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-2 ${healthLevel.bgColor} ${healthLevel.color}`}>
                {healthLevel.label}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <TrendIcon className={`size-4 ${
                  trend.direction === 'improving' ? 'text-green-600' : 
                  trend.direction === 'declining' ? 'text-red-600' : 
                  'text-gray-600'
                }`} />
                <span className="capitalize">{trend.direction}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {vitals.length} readings
              </div>
            </div>
          </div>
          
          {healthScore !== null && (
            <Progress value={healthScore} className="h-2" />
          )}

          {hasHighRisk && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="size-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-700">
                You have {highRiskCount} high-risk reading{highRiskCount > 1 ? 's' : ''}. Consider consulting with a healthcare provider.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Vitals */}
      <div>
        <h3 className="mb-4">Recent Readings</h3>
        {vitals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No vitals recorded yet. Start logging your health data above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitals.map(vital => (
              <RiskCard key={vital.id} entry={vital} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
