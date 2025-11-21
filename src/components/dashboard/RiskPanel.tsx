import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { AlertTriangle, Heart, Droplet, Activity, Moon, ShieldCheck, ShieldAlert } from 'lucide-react';
import { RiskAssessment } from '../../lib/healthData';

interface RiskPanelProps {
  data: RiskAssessment;
}

export function RiskPanel({ data }: RiskPanelProps) {
  const getRiskLevel = (score: number) => {
    if (score < 25) return {
      level: 'Low Risk',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: ShieldCheck
    };
    if (score < 50) return {
      level: 'Moderate Risk',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: ShieldAlert
    };
    if (score < 75) return {
      level: 'High Risk',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: AlertTriangle
    };
    return {
      level: 'Critical Risk',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle
    };
  };

  const overallRisk = getRiskLevel(data.overall_score);
  const OverallIcon = overallRisk.icon;

  const riskFactors = [
    {
      icon: Heart,
      label: 'Cardiovascular',
      score: data.cardiovascular,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Droplet,
      label: 'Diabetes',
      score: data.diabetes,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Activity,
      label: 'Metabolic Syndrome',
      score: data.metabolic_syndrome,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Moon,
      label: 'Sleep Disorder',
      score: data.sleep_disorder,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
        <CardDescription>AI-powered lifestyle disease prediction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className={`p-6 rounded-xl border-2 ${overallRisk.borderColor} ${overallRisk.bgColor}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-white`}>
                <OverallIcon className={`size-6 ${overallRisk.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk</p>
                <p className={`text-lg ${overallRisk.color}`}>{overallRisk.level}</p>
              </div>
            </div>
            <div className={`text-4xl ${overallRisk.color}`}>
              {Math.round(data.overall_score)}
            </div>
          </div>
          
          <Progress 
            value={data.overall_score} 
            className="h-3"
          />
          
          <p className="text-xs text-muted-foreground mt-3">
            Based on vitals, lifestyle factors, and activity patterns
          </p>
        </div>

        {/* Risk Factor Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm">Risk Factor Breakdown</h4>
          
          {riskFactors.map((factor) => {
            const Icon = factor.icon;
            const factorRisk = getRiskLevel(factor.score);
            
            return (
              <div key={factor.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${factor.bgColor}`}>
                      <Icon className={`size-3.5 ${factor.color}`} />
                    </div>
                    <span className="text-sm">{factor.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {Math.round(factor.score)}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${factorRisk.bgColor} ${factorRisk.color}`}>
                      {factorRisk.level.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <Progress value={factor.score} className="h-1.5" />
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="text-sm">Key Recommendations</h4>
          
          {data.overall_score >= 50 && (
            <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-900">
              <p className="mb-2">⚠️ <strong>Elevated risk detected:</strong></p>
              <ul className="space-y-1 ml-4 list-disc">
                {data.cardiovascular >= 40 && <li>Consider cardiovascular screening</li>}
                {data.diabetes >= 40 && <li>Monitor blood glucose levels regularly</li>}
                {data.sleep_disorder >= 40 && <li>Improve sleep hygiene and routine</li>}
                {data.metabolic_syndrome >= 40 && <li>Focus on diet and exercise modifications</li>}
              </ul>
            </div>
          )}
          
          {data.overall_score < 25 && (
            <div className="p-3 bg-green-50 rounded-lg text-xs text-green-900 text-center">
              ✓ Excellent health indicators. Keep up your healthy lifestyle!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
