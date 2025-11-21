import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Heart, Activity, Droplet, Wind, Candy, TrendingUp, TrendingDown } from 'lucide-react';
import { DailyHealthData } from '../../lib/healthData';

interface VitalsOverviewProps {
  currentData: DailyHealthData;
  previousData?: DailyHealthData;
}

export function VitalsOverview({ currentData, previousData }: VitalsOverviewProps) {
  const vitals = currentData.vitals;

  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const metrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: Math.round(vitals.heart_rate),
      unit: 'bpm',
      previous: previousData?.vitals.heart_rate,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      optimal: vitals.heart_rate >= 60 && vitals.heart_rate <= 80
    },
    {
      icon: Activity,
      label: 'HRV',
      value: Math.round(vitals.hrv),
      unit: 'ms',
      previous: previousData?.vitals.hrv,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      optimal: vitals.hrv >= 50
    },
    {
      icon: Droplet,
      label: 'Blood Pressure',
      value: `${Math.round(vitals.systolic)}/${Math.round(vitals.diastolic)}`,
      unit: 'mmHg',
      previous: previousData ? `${Math.round(previousData.vitals.systolic)}/${Math.round(previousData.vitals.diastolic)}` : undefined,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      optimal: vitals.systolic < 120 && vitals.diastolic < 80
    },
    {
      icon: Wind,
      label: 'SpO2',
      value: Math.round(vitals.spo2),
      unit: '%',
      previous: previousData?.vitals.spo2,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      optimal: vitals.spo2 >= 95
    },
    {
      icon: Candy,
      label: 'Glucose',
      value: Math.round(vitals.glucose),
      unit: 'mg/dL',
      previous: previousData?.vitals.glucose,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      optimal: vitals.glucose < 100
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const change = typeof metric.previous === 'number' 
          ? calculateChange(typeof metric.value === 'number' ? metric.value : vitals.heart_rate, metric.previous)
          : null;

        return (
          <Card key={metric.label} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`size-4 ${metric.color}`} />
                </div>
                {metric.optimal && (
                  <div className="size-2 rounded-full bg-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">{metric.unit}</span>
                </div>
                {change !== null && (
                  <div className={`flex items-center gap-1 text-xs ${
                    Math.abs(change) < 1 ? 'text-muted-foreground' :
                    (metric.label === 'HRV' ? change > 0 : change < 0) ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(change) >= 1 && (
                      (metric.label === 'HRV' ? change > 0 : change < 0) ? 
                      <TrendingUp className="size-3" /> : 
                      <TrendingDown className="size-3" />
                    )}
                    <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
