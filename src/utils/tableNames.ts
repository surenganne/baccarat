const adjectives = [
  // Luxurious & Premium
  'Royal', 'Imperial', 'Elite', 'Prestige', 'Luxe', 'Prime', 'Sovereign',
  'Majestic', 'Opulent', 'Regal', 'Supreme', 'Noble', 'Grand', 'Pinnacle',
  
  // Modern & Trendy
  'Stellar', 'Zenith', 'Nova', 'Apex', 'Ultra', 'Prism', 'Pulse',
  'Vertex', 'Echo', 'Flux', 'Aura', 'Vibe', 'Sync', 'Peak',
  
  // Elegant & Refined
  'Crystal', 'Velvet', 'Pearl', 'Sapphire', 'Diamond', 'Platinum', 'Gold',
  'Ivory', 'Azure', 'Jade', 'Onyx', 'Marble', 'Silk', 'Amber'
];

const nouns = [
  // Traditional Casino Terms
  'Palace', 'Lounge', 'Suite', 'Club', 'Room', 'Salon', 'Chamber',
  'Parlor', 'Haven', 'Manor', 'Court', 'Villa', 'Gallery', 'Pavilion',
  
  // Modern Venues
  'Loft', 'Studio', 'Arena', 'Hub', 'Zone', 'Nexus', 'Sphere',
  'Deck', 'Port', 'Base', 'Core', 'Edge', 'Peak', 'Axis',
  
  // Exclusive Spaces
  'Reserve', 'Enclave', 'Retreat', 'Oasis', 'Sanctum', 'Domain', 'Vista',
  'Realm', 'Heights', 'Quarter', 'Circle', 'Terrace', 'Lodge', 'Venue'
];

function generateUniqueId(): string {
  // Generate a 4-character unique identifier
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTableName(): { name: string } {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const uniqueId = generateUniqueId();

  return {
    name: `${adjective} ${noun} ${uniqueId}`
  };
}