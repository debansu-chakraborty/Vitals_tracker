import { useState } from 'react';
import { mockApi, VitalsEntry } from '../lib/mockApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, Heart, Droplet, Wind, Footprints, Moon, Candy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VitalsFormProps {
  userId: string;
  onSaved?: (entry: VitalsEntry) => void;
}

export function VitalsForm({ userId, onSaved }: VitalsFormProps) {
  const [form, setForm] = useState({
    heart_rate: '',
    hr_variability: '',
    systolic: '',
    diastolic: '',
    spo2: '',
    steps: '',
    sleep_hours: '',
    glucose: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        user_id: userId,
        timestamp: new Date().toISOString(),
        heart_rate: form.heart_rate ? Number(form.heart_rate) : null,
        hr_variability: form.hr_variability ? Number(form.hr_variability) : null,
        systolic: form.systolic ? Number(form.systolic) : null,
        diastolic: form.diastolic ? Number(form.diastolic) : null,
        spo2: form.spo2 ? Number(form.spo2) : null,
        steps: form.steps ? Number(form.steps) : null,
        sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
        glucose: form.glucose ? Number(form.glucose) : null,
        notes: form.notes || null
      };

      const result = await mockApi.postVitals(payload);
      
      toast.success('Vitals saved successfully!', {
        description: `Risk score: ${result.risk_score !== null ? Math.round(result.risk_score * 100) + '%' : 'N/A'}`
      });

      // Reset form
      setForm({
        heart_rate: '',
        hr_variability: '',
        systolic: '',
        diastolic: '',
        spo2: '',
        steps: '',
        sleep_hours: '',
        glucose: '',
        notes: ''
      });

      onSaved?.(result);
    } catch (error) {
      toast.error('Failed to save vitals');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputGroups = [
    {
      icon: Heart,
      label: 'Heart Rate',
      name: 'heart_rate',
      placeholder: 'e.g., 72',
      unit: 'bpm',
      description: 'Resting heart rate'
    },
    {
      icon: Activity,
      label: 'HRV',
      name: 'hr_variability',
      placeholder: 'e.g., 45',
      unit: 'ms',
      description: 'Heart rate variability'
    },
    {
      icon: Droplet,
      label: 'Systolic BP',
      name: 'systolic',
      placeholder: 'e.g., 120',
      unit: 'mmHg',
      description: 'Upper blood pressure'
    },
    {
      icon: Droplet,
      label: 'Diastolic BP',
      name: 'diastolic',
      placeholder: 'e.g., 80',
      unit: 'mmHg',
      description: 'Lower blood pressure'
    },
    {
      icon: Wind,
      label: 'SpO2',
      name: 'spo2',
      placeholder: 'e.g., 98',
      unit: '%',
      description: 'Oxygen saturation'
    },
    {
      icon: Footprints,
      label: 'Steps',
      name: 'steps',
      placeholder: 'e.g., 8000',
      unit: 'steps',
      description: 'Daily step count'
    },
    {
      icon: Moon,
      label: 'Sleep',
      name: 'sleep_hours',
      placeholder: 'e.g., 7.5',
      unit: 'hours',
      description: 'Hours of sleep'
    },
    {
      icon: Candy,
      label: 'Glucose',
      name: 'glucose',
      placeholder: 'e.g., 90',
      unit: 'mg/dL',
      description: 'Blood glucose level'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Vitals</CardTitle>
        <CardDescription>
          Enter your health measurements. All fields are optional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.name} className="space-y-2">
                  <Label htmlFor={group.name} className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {group.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={group.name}
                      name={group.name}
                      type="number"
                      step="any"
                      placeholder={group.placeholder}
                      value={form[group.name as keyof typeof form]}
                      onChange={handleChange}
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {group.unit}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional notes about how you're feeling..."
              value={form.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Vitals'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
