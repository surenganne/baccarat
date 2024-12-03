### Business Rules - 3nadh Score Card

### Authentication Rules

1. User Registration
   - Users can register with either username or mobile number (at least one required)
   - PIN must be between 4-6 digits
   - Username and mobile numbers must be unique
   - No email verification required
   - PIN confirmation required during registration
   - New users are created as regular users (non-admin) by default
   - Success message shown after registration
   - Automatic redirection to login screen after successful registration

2. User Login
   - Users can login using either username or mobile number
   - PIN must match exactly
   - Last login timestamp is updated on successful login
   - Different UI elements shown for admin vs regular users
   - Offline login supported with previously used credentials

3. Admin Access
   - Admin users have view-only access to all tables
   - Admin users cannot create, modify, or delete tables
   - Admin users can see table ownership information
   - Admin users can see table creation timestamps
   - Admin status can only be set at the database level
   - Admin users are clearly identified in the UI
   - Admin users see all tables regardless of ownership
   - Admin dashboard shows active and closed table counts

### Table Management Rules

1. Table Creation (Regular Users Only)
   - Tables are auto-named using a combination of:
     - Random fancy adjective (Royal, Imperial, Golden, etc.)
     - Random noun (Palace, Crown, Empire, etc.)
     - 4-character unique identifier (e.g., M7XP)
   - Empty tables (0 hands) are automatically deleted when archived
   - Tables start in 'active' status by default
   - Each table tracks:
     - Creation timestamp
     - Last update timestamp
     - Archive timestamp (when applicable)
     - Hands count
     - User ownership

2. Table Status
   - Only two states allowed: 'active' or 'archived'
   - Active tables can be played and modified
   - Archived tables are read-only
   - Tables can be moved from active to archived (closed)
   - Archived tables cannot be reactivated
   - Regular users can only see their own tables
   - Admins can see all tables but cannot modify them

3. Table Limits
   - Maximum 100 hands per table
   - When limit is reached:
     - Warning is displayed
     - Input controls are disabled
     - User must create new table to continue
   - Hands count is updated in real-time

4. Table Display
   - Tables are displayed in pages of 5 tables each
   - Tables are sorted by creation date (newest first)
   - Active and archived tables are shown in separate tabs
   - Each table shows:
     - Current hands count
     - Status
     - Creation timestamp
     - Owner (admin view only)

### Game Recording Rules

1. Hand Recording
   - Seven possible results:
     - Player
     - Player Natural
     - Banker
     - Banker Natural
     - Banker Super 6
     - Tie
   - Each hand includes:
     - Result type
     - Natural win status
     - Super 6 status
     - Timestamp
   - Only one hand can be recorded at a time
   - Hands are recorded sequentially
   - Real-time updates across all views

2. Hand Modification
   - Last recorded hand can be undone
   - Historical hands cannot be modified
   - Bulk hand deletion not allowed
   - Modifications not allowed for admin users

### View Control Rules

1. Global Controls
   - Show/Hide all sections at once
   - Individual toggles for:
     - Table List
     - Game Input (non-admin only)
     - Predictions
     - Bead Plate
     - Big Road
   - View preferences are persisted
   - Mobile-optimized controls

2. Section Visibility
   - Each section can be independently shown/hidden
   - Default state is all sections visible
   - View state persists across sessions
   - Admin users have same view controls except game input

### Analytics Rules

1. Statistics Calculation
   - Win rates calculated for:
     - Regular wins
     - Natural wins
     - Super 6 wins
     - Ties
   - All calculations based on recorded hands
   - Stats update in real-time

2. Pattern Analysis
   - Patterns analyzed across all tables
   - Minimum hands required for predictions (configurable, default 0)
   - Pattern types tracked:
     - Alternating
     - Streaks
     - Natural wins
     - Super 6
   - Pattern confidence levels displayed

### Display Rules

1. Bead Plate
   - Displays raw sequence of results vertically
   - Reads top to bottom, left to right
   - Shows all result types
   - Natural win indicators
   - Super 6 indicators
   - Supports horizontal scrolling
   - Collapsible display

2. Big Road
   - Displays results in column format
   - Same outcomes stack vertically
   - New column starts when outcome changes
   - Natural win indicators
   - Super 6 indicators
   - Dragon tail pattern support
   - Tie handling in dragon tail
   - Collapsible display

### Mobile Interface Rules

1. Layout
   - Game input fixed at bottom
   - Scrollable content area above
   - Optimized view controls
   - Touch-friendly buttons
   - Responsive grid layouts

2. Navigation
   - Easy access to key functions
   - Simplified table management
   - Optimized for touch interactions
   - Clear visual hierarchy

### Error Handling Rules

1. User Feedback
   - Clear error messages displayed
   - Loading states indicated
   - Success confirmations shown
   - Validation feedback immediate

2. Recovery
   - Automatic retry for failed operations
   - Data preservation during errors
   - Session recovery after disconnection
   - Graceful error handling

### Offline Support Rules

1. Data Storage
   - Tables and hands stored locally
   - View preferences persisted
   - User credentials cached for offline login
   - Sync status tracked

2. Synchronization
   - Auto-sync when coming online
   - Manual sync option available
   - Conflict resolution strategies
   - Progress indicators for sync
   - Error handling for failed syncs

3. Status Indicators
   - Online/offline status visible
   - Sync status displayed
   - Pending changes counter
   - Error notifications
   - Success confirmations