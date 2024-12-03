# 3nadh Score Card

A modern, real-time score tracking system for card games, built with React, TypeScript, and Supabase. Track game results, analyze patterns, and manage multiple tables efficiently.

## Features

### Authentication
- Simple login with username/mobile number and PIN
- No email verification required
- Secure PIN-based authentication
- User session management
- Admin role with view-only access to all tables
  - Table count summary (active/closed)
  - User ownership information
  - Creation timestamps

### Table Management
- Create and manage multiple game tables
- Auto-generated unique table names
- Track active and closed tables
- Maximum 100 hands per table
- Real-time table status updates
- Pagination support (5 tables per page)
- Bulk actions for closing multiple tables
- Empty tables auto-deleted when closed
- Detailed creation timestamps

### Game Recording
- Quick input for game results (Player/Banker/Tie)
- Support for natural wins with dedicated buttons
- Support for Super 6 with special indicator
- Undo last hand capability
- Real-time score updates
- Hand limit notifications
- Mobile-responsive design

### Score Visualization
- Collapsible bead plate display (vertical scoring)
- Collapsible big road representation
- Real-time updates
- Comprehensive game statistics
- Natural win indicators
- Super 6 indicators
- Dragon tail pattern support with tie handling
- Horizontal scrolling for mobile devices

### Analytics & Predictions
- Win rate calculations including natural wins
- Pattern recognition
- Configurable minimum hands requirement (0-100)
- Multi-table data analysis
- Historical data analysis
- Collapsible prediction section

### View Controls
- Global show/hide controls
- Individual section toggles
- Persistent view preferences
- Mobile-optimized interface
- Admin-specific view options

### Offline Support
- Offline mode detection
- Local storage for game data
- Sync mechanism for offline data
- Visual indicators for online/offline status
- Cross-device state synchronization

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Zustand (State Management)
  - Lucide React (Icons)

- **Backend:**
  - Supabase (Database & Authentication)
  - PostgreSQL
  - Real-time subscriptions

## Getting Started

1. **Clone and Install:**
   ```bash
   git clone <repository-url>
   cd 3nadh-score-card
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Update Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Development:**
   ```bash
   npm run dev
   ```

4. **Build:**
   ```bash
   npm run build
   ```

5. **Deploy:**
   - The application is configured for deployment on Netlify
   - Connect your repository to Netlify for automatic deployments
   - Set environment variables in Netlify dashboard

## Project Structure

```
src/
├── components/
│   ├── auth/         # Authentication components
│   ├── game/         # Game-related components
│   ├── layout/       # Layout components
│   ├── common/       # Shared components
│   └── tables/       # Table management components
├── store/            # State management
│   ├── authStore.ts  # Authentication state
│   ├── tableStore.ts # Table management state
│   └── viewStore.ts  # View preferences state
├── hooks/            # Custom hooks
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── lib/             # Library configurations
```

## Mobile Responsiveness

The application is fully responsive with:
- Fixed game input controls at bottom on mobile
- Scrollable content area for predictions and score cards
- Optimized view controls for small screens
- Touch-friendly interface elements
- Smooth horizontal scrolling for game boards

## Security Features

- Secure PIN-based authentication
- Session management
- Admin role management
- Secure API endpoints
- CSP headers configuration
- XSS protection
- CORS policies

## License

This project is licensed under the MIT License - see the LICENSE file for details.