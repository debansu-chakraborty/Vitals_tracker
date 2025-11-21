import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Footprints, Activity, Heart, Flame, MapPin } from 'lucide-react';
import { ActivityMetrics as ActivityMetricsType } from '../../lib/healthData';

interface ActivityMetricsProps {
  data: ActivityMetricsType;
}

export function ActivityMetrics({ data }: ActivityMetricsProps) {
  const stepsGoal = 10000;
  const activeMinutesGoal = 60;
  const stepsPercentage = (data.steps / stepsGoal) * 100;
  const activePercentage = (data.active_minutes / activeMinutesGoal) * 100;

  const getVO2Category = (vo2: number) => {
    if (vo2 >= 50) return { label: 'Superior', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (vo2 >= 42) return { label: 'Excellent', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (vo2 >= 35) return { label: 'Good', color: 'text-cyan-600', bgColor: 'bg-cyan-50' };
    return { label: 'Fair', color: 'text-amber-600', bgColor: 'bg-amber-50' };
  };

  const vo2Category = getVO2Category(data.vo2_max);

  const stats = [
    {
      icon: Footprints,
      label: 'Steps',
      value: data.steps.toLocaleString(),
      goal: stepsGoal.toLocaleString(),
      percentage: stepsPercentage,
      color: 'text-blue-600'
    },
    {
      icon: Activity,
      label: 'Active Minutes',
      value: Math.round(data.active_minutes),
      goal: activeMinutesGoal,
      percentage: activePercentage,
      color: 'text-green-600'
    },
    {
      icon: Flame,
      label: 'Calories',
      value: Math.round(data.calories_burned).toLocaleString(),
      color: 'text-orange-600'
    },
    {
      icon: MapPin,
      label: 'Distance',
      value: data.distance.toFixed(1),
      unit: 'km',
      color: 'text-purple-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity & Fitness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main activity metrics */}
        <div className="grid grid-cols-2 gap-4">
          {stats.slice(0, 2).map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`size-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl">{stat.value}</span>
                    {stat.goal && (
                      <span className="text-xs text-muted-foreground">/ {stat.goal}</span>
                    )}
                  </div>
                  {stat.percentage !== undefined && (
                    <Progress value={Math.min(stat.percentage, 100)} className="h-1.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* VO2 Max */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="size-4 text-blue-600" />
              <span className="text-sm">VO2 Max</span>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs ${vo2Category.bgColor} ${vo2Category.color}`}>
              {vo2Category.label}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl">{data.vo2_max.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">mL/kg/min</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cardiorespiratory fitness indicator
          </p>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 gap-4">
          {stats.slice(2).map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Icon className={`size-4 ${stat.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm">
                    {stat.value} {stat.unit || ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily goal achievement */}
        {stepsPercentage >= 100 && activePercentage >= 100 && (
          <div className="p-3 bg-green-50 rounded-lg text-xs text-green-900 text-center">
            🎉 Great job! You've reached your daily activity goals!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
