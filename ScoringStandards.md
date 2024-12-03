# Scoring Standards - 3nadh Score Card

## General Principles

1. Visual Consistency
   - All icons should be uniform in size
   - Consistent spacing between cells
   - Clear visual hierarchy
   - Mobile-responsive design

2. Color Scheme
   - Player: Blue (#4285f4)
   - Banker: Red (#ea4335)
   - Tie: Green (#34a853)
   - Natural Win: Amber (#f59e0b)
   - Super 6: Red with amber ring
   - Background tints at 10% opacity

## Bead Plate Standards

1. Layout Rules
   - Vertical scoring pattern (top to bottom, then left to right)
   - 6 rows per column
   - Minimum 12 columns visible
   - Scrollable horizontally
   - Cell size: 32px (desktop), 28px (mobile)
   - Gap between cells: 4px

2. Result Display
   - Player: User icon in blue
   - Banker: Crown icon in red
   - Tie: Divide icon in green
   - Natural wins: Star badge in top-right corner
   - Super 6: Number 6 with amber ring
   - Rounded corners (8px radius)
   - Border with result color
   - Background with 10% opacity of result color

## Big Road Standards

1. Layout Rules
   - 6 rows maximum
   - 50 columns minimum
   - Vertical stacking for consecutive results
   - Dragon tail pattern after 6 vertical results
   - Cell size: 32px (desktop), 28px (mobile)
   - Gap between cells: 4px

2. Dragon Tail Rules
   - After 6 vertical results, continue horizontally in last row
   - Ties follow the same pattern in dragon tail
   - Maintain visual consistency in dragon tail section

3. Tie Handling
   - Ties appear in the same column as their preceding result
   - Multiple consecutive ties follow dragon tail pattern
   - Ties in dragon tail continue horizontally

4. Result Display
   - Same visual style as Bead Plate
   - Natural win indicators in same position
   - Super 6 indicator with amber ring
   - Consistent icon usage across both displays

## Mobile Optimization

1. Responsive Design
   - Smaller cell sizes on mobile (28px)
   - Touch-friendly spacing
   - Smooth horizontal scrolling
   - Visible scroll indicators

2. Performance
   - Efficient rendering for large datasets
   - Optimized scrolling performance
   - Memory management for extended sessions
   - Virtual scrolling for large tables

## Icon Standards

1. Icon Sizes
   - Regular: 16px (desktop), 14px (mobile)
   - Natural indicator: 14px (desktop), 12px (mobile)
   - Super 6: 16px (desktop), 14px (mobile)
   - Consistent padding within cells

2. Icon Colors
   - Player icon: #4285f4 (Google Blue)
   - Banker icon: #ea4335 (Google Red)
   - Tie icon: #34a853 (Google Green)
   - Natural star: White on amber background
   - Super 6: Red with amber ring

## Visual Hierarchy

1. Primary Elements
   - Result icons (Player/Banker/Tie)
   - Cell borders
   - Background tints

2. Secondary Elements
   - Natural win indicators
   - Super 6 indicators
   - Grid lines
   - Scroll indicators

3. Spacing Guidelines
   - Consistent 4px gap between cells
   - 16px padding around scorecard
   - 8px minimum margin between sections

## Accessibility Standards

1. Color Contrast
   - Minimum 4.5:1 contrast ratio for text
   - Distinct visual differences between results
   - Clear indicators for natural wins
   - High contrast for Super 6 indicator

2. Interactive Elements
   - Touch targets minimum 44x44px on mobile
   - Clear hover/focus states
   - Smooth transitions
   - Clear feedback on interactions

## Implementation Notes

1. Code Structure
   - Modular components for each scorecard type
   - Shared styling utilities
   - Consistent naming conventions
   - Responsive breakpoints

2. Performance Optimization
   - Virtual scrolling for large datasets
   - Efficient DOM updates
   - Optimized rendering cycles
   - Proper memoization

3. State Management
   - Centralized game state
   - Efficient updates
   - Proper error handling
   - Real-time synchronization
   - Offline data persistence

4. Quality Assurance
   - Visual regression testing
   - Cross-browser compatibility
   - Mobile device testing
   - Performance benchmarking
   - Offline functionality testing