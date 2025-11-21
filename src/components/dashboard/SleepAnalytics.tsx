import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Moon, Eye, Zap, Clock } from 'lucide-react';
import { SleepAnalytics as SleepAnalyticsType } from '../../lib/healthData';

interface SleepAnalyticsProps {
  data: SleepAnalyticsType;
}

export function SleepAnalytics({ data }: SleepAnalyticsProps) {
  const getSleepScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getSleepScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const sleepStages = [
    {
      icon: Eye,
      label: 'REM',
      hours: data.rem_hours,
      color: 'bg-purple-500',
      percentage: (data.rem_hours / data.total_hours) * 100
    },
    {
      icon: Zap,
      label: 'Deep',
      hours: data.deep_hours,
      color: 'bg-blue-600',
      percentage: (data.deep_hours / data.total_hours) * 100
    },
    {
      icon: Moon,
      label: 'Light',
      hours: data.light_hours,
      color: 'bg-blue-300',
      percentage: (data.light_hours / data.total_hours) * 100
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="size-5" />
            <CardTitle>Sleep Analysis</CardTitle>
          </div>
          <div className={`text-2xl ${getSleepScoreColor(data.sleep_score)}`}>
            {Math.round(data.sleep_score)}
          </div>
        </div>
        <CardDescription>Last night's sleep quality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sleep Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sleep Score</span>
            <span className={getSleepScoreColor(data.sleep_score)}>
              {getSleepScoreLabel(data.sleep_score)}
            </span>
          </div>
          <Progress value={data.sleep_score} className="h-2" />
        </div>

        {/* Total Sleep */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Clock className="size-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl">{data.total_hours.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Total Hours</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl">{Math.round(data.efficiency)}%</div>
            <p className="text-xs text-muted-foreground">Efficiency</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl">{data.awakenings}</div>
            <p className="text-xs text-muted-foreground">Awakenings</p>
          </div>
        </div>

        {/* Sleep Stages */}
        <div className="space-y-3">
          <p className="text-sm">Sleep Stages</p>
          
          {/* Visual breakdown */}
          <div className="h-8 flex rounded-lg overflow-hidden">
            {sleepStages.map((stage) => (
              <div
                key={stage.label}
                className={stage.color}
                style={{ width: `${stage.percentage}%` }}
              />
            ))}
          </div>

          {/* Stage details */}
          <div className="grid grid-cols-3 gap-2">
            {sleepStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.label} className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${stage.color}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{stage.label}</p>
                    <p className="text-sm">{stage.hours.toFixed(1)}h</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        {data.sleep_score < 70 && (
          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900">
            <p>💡 <strong>Tip:</strong> Aim for 7-9 hours of sleep. Consider reducing screen time before bed.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
