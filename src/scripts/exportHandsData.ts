import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllHands() {
  const allHands = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;
  
  while (hasMore) {
    const { data, error } = await supabase
      .from('hands')
      .select('table_id,result')
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) break;

    allHands.push(...data);
    hasMore = data.length === pageSize;
    page++;

    console.log(`Fetched ${allHands.length} records...`);
  }

  return allHands;
}

async function exportHandsData() {
  try {
    console.log('Fetching hands data from Supabase...');
    const hands = await fetchAllHands();

    if (!hands || hands.length === 0) {
      console.log('No data found in hands table');
      return;
    }

    // Convert to CSV format
    const csvContent = [
      'table_id,result',
      ...hands.map(row => `${row.table_id},${row.result}`)
    ].join('\n');

    // Get current file and directory paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Calculate assets directory path
    const assetsDir = path.join(__dirname, '..', 'assets');
    
    // Create assets directory if it doesn't exist
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(assetsDir, 'hands_export.csv');
    fs.writeFileSync(filePath, csvContent, 'utf-8');

    console.log(`Successfully exported ${hands.length} records to ${filePath}`);
    return hands.length;
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
}

// Execute if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exportHandsData();
}