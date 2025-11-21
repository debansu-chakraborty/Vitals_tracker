import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Activity, Droplet, Wind, Footprints, Moon, Candy, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { VitalsEntry } from '../lib/api';

interface RiskCardProps {
  entry: VitalsEntry;
}

export function RiskCard({ entry }: RiskCardProps) {
  const getRiskLevel = (score: number | null) => {
    if (score === null) return { level: 'unknown', color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
    if (score < 0.3) return { level: 'low', color: 'bg-green-100 text-green-700', icon: CheckCircle };
    if (score < 0.7) return { level: 'moderate', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle };
    return { level: 'high', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
  };

  const risk = getRiskLevel(entry.risk_score);
  const RiskIcon = risk.icon;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const metrics = [
    { icon: Heart, value: entry.heart_rate, unit: 'bpm', label: 'HR' },
    { icon: Activity, value: entry.hr_variability, unit: 'ms', label: 'HRV' },
    { icon: Droplet, value: entry.systolic && entry.diastolic ? `${entry.systolic}/${entry.diastolic}` : null, unit: 'mmHg', label: 'BP' },
    { icon: Wind, value: entry.spo2, unit: '%', label: 'SpO2' },
    { icon: Footprints, value: entry.steps, unit: 'steps', label: 'Steps' },
    { icon: Moon, value: entry.sleep_hours, unit: 'hrs', label: 'Sleep' },
    { icon: Candy, value: entry.glucose, unit: 'mg/dL', label: 'Glucose' }
  ].filter(m => m.value !== null && m.value !== undefined);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{formatDate(entry.timestamp)}</p>
          </div>
          <Badge className={risk.color} variant="secondary">
            <RiskIcon className="size-3 mr-1" />
            {risk.level}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {metrics.slice(0, 6).map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm">
                    {metric.value} <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {entry.risk_score !== null && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Risk Score</span>
              <span className={`text-sm ${entry.risk_score > 0.7 ? 'text-red-600' : entry.risk_score > 0.35 ? 'text-yellow-600' : 'text-green-600'}`}>
                {Math.round(entry.risk_score * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full transition-all ${
                  entry.risk_score > 0.7 ? 'bg-red-600' : 
                  entry.risk_score > 0.35 ? 'bg-yellow-600' : 
                  'bg-green-600'
                }`}
                style={{ width: `${entry.risk_score * 100}%` }}
              />
            </div>
          </div>
        )}

        {entry.notes && (
          <p className="text-xs text-muted-foreground italic pt-2 border-t">
            "{entry.notes}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}