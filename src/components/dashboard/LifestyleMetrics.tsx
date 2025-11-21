import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Droplets, Coffee, Wine, Smartphone } from 'lucide-react';
import { LifestyleInputs } from '../../lib/healthData';

interface LifestyleMetricsProps {
  data: LifestyleInputs;
}

export function LifestyleMetrics({ data }: LifestyleMetricsProps) {
  const metrics = [
    {
      icon: Droplets,
      label: 'Hydration',
      value: data.water_intake,
      unit: 'ml',
      goal: 2500,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progressColor: 'bg-blue-600'
    },
    {
      icon: Coffee,
      label: 'Caffeine',
      value: data.caffeine,
      unit: 'mg',
      goal: 400,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      progressColor: 'bg-amber-600',
      warning: data.caffeine > 400
    },
    {
      icon: Wine,
      label: 'Alcohol',
      value: data.alcohol,
      unit: 'units',
      goal: 2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progressColor: 'bg-purple-600',
      warning: data.alcohol > 2
    },
    {
      icon: Smartphone,
      label: 'Screen Time',
      value: data.screen_time,
      unit: 'hrs',
      goal: 6,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      progressColor: 'bg-slate-600',
      warning: data.screen_time > 8
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = (metric.value / metric.goal) * 100;
          
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${metric.bgColor}`}>
                    <Icon className={`size-4 ${metric.color}`} />
                  </div>
                  <span className="text-sm">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-sm ${metric.warning ? 'text-red-600' : ''}`}>
                    {typeof metric.value === 'number' && metric.value % 1 !== 0 
                      ? metric.value.toFixed(1) 
                      : Math.round(metric.value)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {metric.goal} {metric.unit}</span>
                </div>
              </div>
              
              <div className="relative">
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                />
                {metric.warning && (
                  <p className="text-xs text-red-600 mt-1">Above recommended limit</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-muted/50 rounded text-center">
              <p className="text-muted-foreground">Daily Goal Progress</p>
              <p className="text-sm mt-1">
                {metrics.filter(m => !m.warning && (m.value / m.goal) >= 0.8).length}/{metrics.length}
              </p>
            </div>
            <div className="p-2 bg-muted/50 rounded text-center">
              <p className="text-muted-foreground">Needs Attention</p>
              <p className="text-sm mt-1">
                {metrics.filter(m => m.warning).length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
