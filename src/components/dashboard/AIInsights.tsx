import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Sparkles, CheckCircle, AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react';
import { HealthInsight } from '../../lib/healthData';
import { Badge } from '../ui/badge';

interface AIInsightsProps {
  insights: HealthInsight[];
}

export function AIInsights({ insights }: AIInsightsProps) {
  const getInsightConfig = (category: HealthInsight['category']) => {
    switch (category) {
      case 'positive':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badge: 'Good'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          badge: 'Attention'
        };
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badge: 'Important'
        };
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badge: 'Info'
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-purple-600" />
          <CardTitle>AI Health Insights</CardTitle>
        </div>
        <CardDescription>
          Personalized recommendations based on your health data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Keep logging your health data to receive personalized insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => {
              const config = getInsightConfig(insight.category);
              const Icon = config.icon;
              
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-2 ${config.borderColor} ${config.bgColor} space-y-2`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`size-5 ${config.color} mt-0.5 flex-shrink-0`} />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm">{insight.title}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${config.bgColor} ${config.color} border-none`}
                          >
                            {config.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  {insight.recommendation && (
                    <div className="flex items-start gap-2 ml-8 mt-2">
                      <Lightbulb className={`size-4 ${config.color} mt-0.5 flex-shrink-0`} />
                      <p className="text-xs text-muted-foreground">
                        <strong>Recommendation:</strong> {insight.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {insights.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded bg-green-50">
                <p className="text-lg text-green-600">
                  {insights.filter(i => i.category === 'positive').length}
                </p>
                <p className="text-xs text-muted-foreground">Positive</p>
              </div>
              <div className="p-2 rounded bg-blue-50">
                <p className="text-lg text-blue-600">
                  {insights.filter(i => i.category === 'info').length}
                </p>
                <p className="text-xs text-muted-foreground">Info</p>
              </div>
              <div className="p-2 rounded bg-amber-50">
                <p className="text-lg text-amber-600">
                  {insights.filter(i => i.category === 'warning').length}
                </p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
              <div className="p-2 rounded bg-red-50">
                <p className="text-lg text-red-600">
                  {insights.filter(i => i.category === 'critical').length}
                </p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
