import { Hand } from './index';

export interface BigRoadCell {
  outcome: 'player' | 'banker';
  ties: number;
  position: {
    row: number;
    column: number;
  };
  isNatural: boolean;
  pairs: {
    player: boolean;
    banker: boolean;
  };
  gameResults: Hand[];
}

export interface ScoreCardConfig {
  maxRows: number;
  maxColumns: number;
  cellSize: {
    width: number;
    height: number;
  };
  colors: {
    banker: string;
    player: string;
    tie: string;
    background: string;
    grid: string;
  };
  symbols: {
    tie: string;
    natural: string;
  };
}

export const defaultConfig: ScoreCardConfig = {
  maxRows: 6,
  maxColumns: 50,
  cellSize: {
    width: 40,
    height: 40
  },
  colors: {
    banker: '#e74c3c',
    player: '#3498db',
    tie: '#2ecc71',
    background: '#ffffff',
    grid: '#ecf0f1'
  },
  symbols: {
    tie: '○',
    natural: '_'
  }
};