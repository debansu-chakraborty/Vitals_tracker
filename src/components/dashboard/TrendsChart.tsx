import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyHealthData } from '../../lib/healthData';

interface TrendsChartProps {
  data: DailyHealthData[];
}

export function TrendsChart({ data }: TrendsChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const vitalsData = data.map(d => ({
    date: formatDate(d.date),
    'Heart Rate': Math.round(d.vitals.heart_rate),
    'HRV': Math.round(d.vitals.hrv),
    'Systolic BP': Math.round(d.vitals.systolic),
    'Diastolic BP': Math.round(d.vitals.diastolic),
    'SpO2': Math.round(d.vitals.spo2),
    'Glucose': Math.round(d.vitals.glucose)
  }));

  const sleepData = data.map(d => ({
    date: formatDate(d.date),
    'Total Hours': parseFloat(d.sleep.total_hours.toFixed(1)),
    'REM': parseFloat(d.sleep.rem_hours.toFixed(1)),
    'Deep': parseFloat(d.sleep.deep_hours.toFixed(1)),
    'Light': parseFloat(d.sleep.light_hours.toFixed(1)),
    'Sleep Score': Math.round(d.sleep.sleep_score)
  }));

  const activityData = data.map(d => ({
    date: formatDate(d.date),
    'Steps': d.activity.steps,
    'Active Minutes': Math.round(d.activity.active_minutes),
    'VO2 Max': parseFloat(d.activity.vo2_max.toFixed(1))
  }));

  const lifestyleData = data.map(d => ({
    date: formatDate(d.date),
    'Water (L)': parseFloat((d.lifestyle.water_intake / 1000).toFixed(1)),
    'Caffeine (mg)': Math.round(d.lifestyle.caffeine),
    'Screen Time (hrs)': parseFloat(d.lifestyle.screen_time.toFixed(1))
  }));

  const riskData = data.map(d => ({
    date: formatDate(d.date),
    'Overall Risk': Math.round(d.risk.overall_score),
    'Cardiovascular': Math.round(d.risk.cardiovascular),
    'Diabetes': Math.round(d.risk.diabetes),
    'Metabolic': Math.round(d.risk.metabolic_syndrome)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Trends</CardTitle>
        <CardDescription>7-day health metrics visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vitals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Heart Rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="HRV" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Systolic BP" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="SpO2" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Glucose" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="sleep">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="Deep" stackId="1" stroke="#2563eb" fill="#3b82f6" />
                <Area type="monotone" dataKey="REM" stackId="1" stroke="#7c3aed" fill="#8b5cf6" />
                <Area type="monotone" dataKey="Light" stackId="1" stroke="#60a5fa" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Sleep Score" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="activity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="Steps" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="Active Minutes" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="VO2 Max" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="lifestyle">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lifestyleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Water (L)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Caffeine (mg)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Screen Time (hrs)" stroke="#64748b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="risk">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="Overall Risk" stroke="#ef4444" fill="#fca5a5" fillOpacity={0.6} strokeWidth={2} />
                <Area type="monotone" dataKey="Cardiovascular" stroke="#dc2626" fill="#fca5a5" fillOpacity={0.3} strokeWidth={1} />
                <Area type="monotone" dataKey="Diabetes" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.3} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
