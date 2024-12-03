import { supabase } from '../lib/supabase';

export async function exportHandsData(): Promise<number> {
  try {
    // Run the export script using npm
    const process = await fetch('/_api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: 'npm run export-data'
      }),
    });

    if (!process.ok) {
      throw new Error('Failed to run export script');
    }

    const { data, error } = await supabase
      .from('hands')
      .select('count');

    if (error) throw error;
    return data?.[0]?.count || 0;

  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}