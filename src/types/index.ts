export type GameResult = 'player' | 'banker' | 'tie' | 'playerNatural' | 'bankerNatural' | 'bankerSuper6';

export interface Hand {
  id?: string;
  result: GameResult;
  timestamp?: string;
  score: {
    player: number;
    banker: number;
  };
}

export type TableStatus = 'active' | 'archived';

export interface Table {
  id: string;
  name: string;
  category: string;
  status: TableStatus;
  hands: Hand[];
  created_at: string;
  updated_at: string;
  archived_at?: string;
  imported_at?: string;
  users?: {
    username?: string;
    mobile_number?: string;
  };
}