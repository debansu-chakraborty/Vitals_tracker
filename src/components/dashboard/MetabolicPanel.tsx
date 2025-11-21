import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { FlaskConical, TrendingUp } from 'lucide-react';
import { MetabolicPanel as MetabolicPanelType } from '../../lib/healthData';

interface MetabolicPanelProps {
  data?: MetabolicPanelType;
}

export function MetabolicPanel({ data }: MetabolicPanelProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FlaskConical className="size-5" />
            <CardTitle>Metabolic Panel</CardTitle>
          </div>
          <CardDescription>Lab results not available</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Schedule a blood test to view comprehensive metabolic markers.
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: 'Fasting Glucose',
      value: data.fasting_glucose,
      unit: 'mg/dL',
      optimal: data.fasting_glucose < 100,
      range: '70-99 mg/dL'
    },
    {
      label: 'HbA1c',
      value: data.hba1c,
      unit: '%',
      optimal: data.hba1c < 5.7,
      range: '< 5.7%'
    },
    {
      label: 'Total Cholesterol',
      value: data.total_cholesterol,
      unit: 'mg/dL',
      optimal: data.total_cholesterol < 200,
      range: '< 200 mg/dL'
    },
    {
      label: 'LDL Cholesterol',
      value: data.ldl,
      unit: 'mg/dL',
      optimal: data.ldl < 100,
      range: '< 100 mg/dL'
    },
    {
      label: 'HDL Cholesterol',
      value: data.hdl,
      unit: 'mg/dL',
      optimal: data.hdl >= 40,
      range: '≥ 40 mg/dL'
    },
    {
      label: 'Triglycerides',
      value: data.triglycerides,
      unit: 'mg/dL',
      optimal: data.triglycerides < 150,
      range: '< 150 mg/dL'
    }
  ];

  const allOptimal = metrics.every(m => m.optimal);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-5" />
            <CardTitle>Metabolic Panel</CardTitle>
          </div>
          {allOptimal && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="size-3" />
              All markers optimal
            </div>
          )}
        </div>
        <CardDescription>Latest lab results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={metric.label}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">Optimal: {metric.range}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${metric.optimal ? 'text-green-600' : 'text-amber-600'}`}>
                    {metric.value} {metric.unit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metric.optimal ? 'Optimal' : 'Elevated'}
                  </p>
                </div>
              </div>
              {!metric.optimal && (
                <div className="mt-2 p-2 bg-amber-50 rounded text-xs text-amber-700">
                  Consider lifestyle modifications or consult your healthcare provider
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
