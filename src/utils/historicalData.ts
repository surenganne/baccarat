import { GameResult } from '../types';

// Map game results to binary outcomes (0 for player, 1 for banker)
export function mapGameResult(result: GameResult): number {
  if (result.includes('player')) return 0;
  if (result.includes('banker')) return 1;
  return -1; // For ties
}

// Load and parse CSV data
export async function loadHistoricalData(): Promise<Record<string, number[]>> {
  try {
    const response = await fetch('/src/assets/hands_export.csv');
    const csvText = await response.text();
    
    // Skip header row and split into lines
    const lines = csvText.split('\n').slice(1);
    
    // Create map of table_id to results
    const historicalData: Record<string, number[]> = {};
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const [tableId, result] = line.split(',');
      if (!tableId || !result) return;
      
      const mappedResult = mapGameResult(result as GameResult);
      if (mappedResult === -1) return; // Skip ties
      
      if (!historicalData[tableId]) {
        historicalData[tableId] = [];
      }
      
      historicalData[tableId].push(mappedResult);
    });
    
    return historicalData;
  } catch (error) {
    console.error('Error loading historical data:', error);
    return {};
  }
}