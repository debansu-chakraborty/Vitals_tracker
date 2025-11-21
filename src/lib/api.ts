// src/lib/api.ts - The Communication Bridge to FastAPI

// Define the core data structure (Must match backend/app/schemas.py VitalsEntry)
export interface VitalsEntry {
    id: number;
    user_id: string;
    timestamp: string;
    heart_rate: number | null;
    hr_variability: number | null;
    systolic: number | null;
    diastolic: number | null;
    spo2: number | null;
    steps: number | null;
    sleep_hours: number | null;
    glucose: number | null;
    notes: string | null;
    risk_score: number | null; 
}

export interface HealthScore {
    health_score: number | null;
}

// Ensure this URL matches where your FastAPI server is running
const API_BASE = 'http://localhost:8000';

/**
 * Posts new vital readings to the backend.
 */
export async function postVitals(payload: any): Promise<VitalsEntry> {
    try {
        const response = await fetch(`${API_BASE}/vitals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Throw the specific response text/status for better debugging
            const errorBody = await response.json().catch(() => ({ detail: 'Unknown Error' }));
            throw new Error(`API Error ${response.status}: ${JSON.stringify(errorBody)}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error posting vitals:", error);
        throw new Error("Failed to save vitals via API.");
    }
}

/**
 * Retrieves the complete history of vital entries for a user.
 */
export async function getVitals(userId: string): Promise<VitalsEntry[]> {
    const response = await fetch(`${API_BASE}/vitals/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch vitals history.");
    }
    return response.json();
}

/**
 * Retrieves the computed Health Score based on recent vital entries.
 */
export async function getHealthScore(userId: string): Promise<HealthScore> {
    const response = await fetch(`${API_BASE}/healthscore/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch health score.");
    }
    return response.json();
}