import { useState } from 'react';
import { ComprehensiveDashboard } from './components/ComprehensiveDashboard';
import { VitalsForm } from './components/VitalsForm';
import { HealthDashboard } from './components/HealthDashboard';
import { Toaster } from './components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Activity, BarChart3, Plus, Info, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

export default function App() {
  const [userId] = useState('demo_user');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVitalsSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Activity className="size-7 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vitals Tracker
                </h1>
                <p className="text-muted-foreground">
                  AI-Powered Comprehensive Health Analytics Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
              <Sparkles className="size-4 text-purple-600" />
              <span className="text-sm text-purple-900">AI Insights Active</span>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="size-4" />
          <AlertTitle>Advanced Health Analytics Dashboard</AlertTitle>
          <AlertDescription>
            This comprehensive dashboard tracks vitals, metabolic markers, sleep patterns, lifestyle factors, and activity metrics with AI-powered risk assessment. Demo uses simulated ML predictions and local storage.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="log" className="flex items-center gap-2">
              <Plus className="size-4" />
              Log Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <ComprehensiveDashboard />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <HealthDashboard userId={userId} refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="log" className="space-y-6">
            <VitalsForm userId={userId} onSaved={handleVitalsSaved} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="text-sm text-muted-foreground mb-1">Data Sources</h4>
                <p className="text-xs">
                  Smartphone sensors (camera for HR/SpO2), fitness trackers, manual entry
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="text-sm text-muted-foreground mb-1">ML Model</h4>
                <p className="text-xs">
                  Random Forest classifier trained on lifestyle disease risk factors
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="text-sm text-muted-foreground mb-1">Privacy</h4>
                <p className="text-xs">
                  All data processed locally. Connect backend for cloud sync & persistence
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            Vitals Tracker • Advanced Health Analytics Platform • Built for Healthcare Innovation
          </p>
          <p className="text-xs mt-2">
            For demo purposes only. Not intended for medical diagnosis. Connect to FastAPI backend at <code className="bg-muted px-1 rounded">http://localhost:8000</code>
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  );
}