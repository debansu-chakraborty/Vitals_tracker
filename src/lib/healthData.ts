// Comprehensive health data types and mock data generator

export interface AdvancedVitals {
  heart_rate: number;
  hrv: number;
  systolic: number;
  diastolic: number;
  spo2: number;
  glucose: number;
}

export interface MetabolicPanel {
  fasting_glucose: number;
  hba1c: number;
  total_cholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides: number;
}

export interface SleepAnalytics {
  total_hours: number;
  rem_hours: number;
  deep_hours: number;
  light_hours: number;
  sleep_score: number;
  efficiency: number;
  awakenings: number;
}

export interface LifestyleInputs {
  water_intake: number; // ml
  caffeine: number; // mg
  alcohol: number; // units
  screen_time: number; // hours
}

export interface ActivityMetrics {
  steps: number;
  active_minutes: number;
  vo2_max: number;
  calories_burned: number;
  distance: number; // km
}

export interface RiskAssessment {
  overall_score: number; // 0-100
  cardiovascular: number;
  diabetes: number;
  metabolic_syndrome: number;
  sleep_disorder: number;
}

export interface DailyHealthData {
  date: string;
  vitals: AdvancedVitals;
  metabolic?: MetabolicPanel;
  sleep: SleepAnalytics;
  lifestyle: LifestyleInputs;
  activity: ActivityMetrics;
  risk: RiskAssessment;
}

// Generate realistic mock data for the past 7 days
export function generateMockHealthData(): DailyHealthData[] {
  const data: DailyHealthData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some variance to make data realistic
    const stressLevel = Math.random() * 0.3 + (i === 3 ? 0.5 : 0); // Day 3 is stressful
    const goodSleep = i % 3 !== 1; // Every 3rd day has poor sleep

    data.push({
      date: date.toISOString().split('T')[0],
      vitals: {
        heart_rate: 65 + Math.random() * 15 + stressLevel * 20,
        hrv: 55 - stressLevel * 20 + Math.random() * 10,
        systolic: 115 + Math.random() * 10 + stressLevel * 15,
        diastolic: 75 + Math.random() * 8 + stressLevel * 8,
        spo2: 97 + Math.random() * 2,
        glucose: 85 + Math.random() * 15 + stressLevel * 10
      },
      metabolic: i === 0 ? {
        fasting_glucose: 92,
        hba1c: 5.4,
        total_cholesterol: 185,
        ldl: 110,
        hdl: 55,
        triglycerides: 100
      } : undefined,
      sleep: {
        total_hours: goodSleep ? 7 + Math.random() * 1.5 : 5 + Math.random() * 1,
        rem_hours: goodSleep ? 1.5 + Math.random() * 0.5 : 0.8 + Math.random() * 0.3,
        deep_hours: goodSleep ? 1.8 + Math.random() * 0.4 : 1 + Math.random() * 0.3,
        light_hours: goodSleep ? 3.5 + Math.random() * 0.8 : 3 + Math.random() * 0.5,
        sleep_score: goodSleep ? 75 + Math.random() * 20 : 50 + Math.random() * 15,
        efficiency: goodSleep ? 85 + Math.random() * 10 : 70 + Math.random() * 10,
        awakenings: goodSleep ? Math.floor(Math.random() * 3) : Math.floor(2 + Math.random() * 4)
      },
      lifestyle: {
        water_intake: 1500 + Math.random() * 1500,
        caffeine: 100 + Math.random() * 200 + stressLevel * 150,
        alcohol: Math.random() > 0.7 ? Math.random() * 2 : 0,
        screen_time: 4 + Math.random() * 4 + stressLevel * 2
      },
      activity: {
        steps: 6000 + Math.random() * 6000 - stressLevel * 2000,
        active_minutes: 30 + Math.random() * 60 - stressLevel * 20,
        vo2_max: 42 + Math.random() * 5,
        calories_burned: 1800 + Math.random() * 600,
        distance: 4 + Math.random() * 4
      },
      risk: calculateRiskScore({
        heart_rate: 65 + stressLevel * 20,
        systolic: 115 + stressLevel * 15,
        glucose: 85 + stressLevel * 10,
        sleep_hours: goodSleep ? 7.5 : 5.5,
        activity_minutes: 60 - stressLevel * 20
      })
    });
  }

  return data;
}

function calculateRiskScore(factors: {
  heart_rate: number;
  systolic: number;
  glucose: number;
  sleep_hours: number;
  activity_minutes: number;
}): RiskAssessment {
  let cardioRisk = 0;
  let diabetesRisk = 0;
  let metabolicRisk = 0;
  let sleepRisk = 0;

  // Cardiovascular risk
  if (factors.heart_rate > 80) cardioRisk += 20;
  if (factors.heart_rate > 90) cardioRisk += 20;
  if (factors.systolic > 130) cardioRisk += 25;
  if (factors.systolic > 140) cardioRisk += 25;
  if (factors.activity_minutes < 30) cardioRisk += 10;

  // Diabetes risk
  if (factors.glucose > 100) diabetesRisk += 30;
  if (factors.glucose > 110) diabetesRisk += 30;
  if (factors.glucose > 125) diabetesRisk += 20;
  if (factors.activity_minutes < 30) diabetesRisk += 20;

  // Metabolic syndrome risk
  metabolicRisk = (cardioRisk + diabetesRisk) / 2;
  if (factors.activity_minutes < 20) metabolicRisk += 15;

  // Sleep disorder risk
  if (factors.sleep_hours < 6) sleepRisk += 40;
  if (factors.sleep_hours < 5) sleepRisk += 30;
  if (factors.sleep_hours > 9) sleepRisk += 20;

  const overallScore = Math.min(
    100,
    (cardioRisk * 0.3 + diabetesRisk * 0.3 + metabolicRisk * 0.2 + sleepRisk * 0.2)
  );

  return {
    overall_score: overallScore,
    cardiovascular: Math.min(100, cardioRisk),
    diabetes: Math.min(100, diabetesRisk),
    metabolic_syndrome: Math.min(100, metabolicRisk),
    sleep_disorder: Math.min(100, sleepRisk)
  };
}

// AI Insights Generator
export interface HealthInsight {
  id: string;
  category: 'positive' | 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  recommendation?: string;
}

export function generateAIInsights(data: DailyHealthData[]): HealthInsight[] {
  const insights: HealthInsight[] = [];
  const latest = data[data.length - 1];
  const weekAvg = {
    heart_rate: data.reduce((sum, d) => sum + d.vitals.heart_rate, 0) / data.length,
    sleep: data.reduce((sum, d) => sum + d.sleep.total_hours, 0) / data.length,
    steps: data.reduce((sum, d) => sum + d.activity.steps, 0) / data.length,
    hrv: data.reduce((sum, d) => sum + d.vitals.hrv, 0) / data.length
  };

  // Sleep insights
  if (weekAvg.sleep < 6.5) {
    insights.push({
      id: 'sleep-1',
      category: 'warning',
      title: 'Sleep Deficit Detected',
      message: `Your average sleep is ${weekAvg.sleep.toFixed(1)} hours, below the recommended 7-9 hours.`,
      recommendation: 'Establish a consistent bedtime routine and reduce screen time before bed.'
    });
  } else if (latest.sleep.sleep_score > 85) {
    insights.push({
      id: 'sleep-2',
      category: 'positive',
      title: 'Excellent Sleep Quality',
      message: `Last night's sleep score of ${Math.round(latest.sleep.sleep_score)} indicates optimal recovery.`,
      recommendation: 'Keep up your current sleep habits!'
    });
  }

  // Activity insights
  if (weekAvg.steps < 7000) {
    insights.push({
      id: 'activity-1',
      category: 'warning',
      title: 'Low Activity Levels',
      message: `Weekly average of ${Math.round(weekAvg.steps)} steps is below the 10,000 step goal.`,
      recommendation: 'Try adding a 15-minute walk after meals to boost daily activity.'
    });
  }

  // Heart health insights
  if (latest.vitals.hrv < 40) {
    insights.push({
      id: 'heart-1',
      category: 'warning',
      title: 'Low Heart Rate Variability',
      message: 'HRV below 40ms may indicate elevated stress or inadequate recovery.',
      recommendation: 'Consider stress management techniques like meditation or deep breathing.'
    });
  }

  // Blood pressure
  if (latest.vitals.systolic > 130 || latest.vitals.diastolic > 85) {
    insights.push({
      id: 'bp-1',
      category: 'critical',
      title: 'Elevated Blood Pressure',
      message: `Reading of ${Math.round(latest.vitals.systolic)}/${Math.round(latest.vitals.diastolic)} is above normal range.`,
      recommendation: 'Monitor daily and consult with a healthcare provider if readings remain elevated.'
    });
  }

  // Hydration
  if (latest.lifestyle.water_intake < 2000) {
    insights.push({
      id: 'hydration-1',
      category: 'info',
      title: 'Hydration Goal',
      message: `Current intake: ${Math.round(latest.lifestyle.water_intake)}ml. Aim for 2000-3000ml daily.`,
      recommendation: 'Keep a water bottle nearby and set hourly reminders.'
    });
  }

  // VO2 Max
  if (latest.activity.vo2_max > 45) {
    insights.push({
      id: 'fitness-1',
      category: 'positive',
      title: 'Strong Cardiovascular Fitness',
      message: `VO2 Max of ${latest.activity.vo2_max.toFixed(1)} indicates excellent aerobic capacity.`,
      recommendation: 'Maintain your current exercise routine for long-term health benefits.'
    });
  }

  return insights;
}

// Store and retrieve data
const STORAGE_KEY = 'health_tracker_comprehensive_data';

export function getStoredHealthData(): DailyHealthData[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const newData = generateMockHealthData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  return newData;
}

export function saveHealthData(data: DailyHealthData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
