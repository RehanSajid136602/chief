# Design System Documentation

## Color Palette

### Primary Colors
- **Background**: `zinc-950` (#09090b) - Main dark background
- **Foreground**: `zinc-50` (#fafafa) - Primary text color

### Accent Colors
- **Emerald**: `emerald-400` (#34d399) - Primary accent (success, highlights)
- **Amber**: `amber-400` (#fbbf24) - Secondary accent (warnings, highlights)

### Neutral Colors
- `zinc-900` - Card backgrounds
- `zinc-800` - Borders, secondary backgrounds
- `zinc-700` - Hover states
- `zinc-600` - Muted text
- `zinc-500` - Placeholder text
- `zinc-400` - Secondary text
- `zinc-300` - Body text
- `zinc-200` - Headings
- `zinc-100` - Primary headings

## Typography

### Font Family
- **Geist Sans** - Primary font (Next.js default)
- Fallback: `system-ui, sans-serif`

### Font Weights & Hierarchy
- `800` - Hero headlines
- `700` - Page titles
- `600` - Section headings
- `500` - Subheadings
- `400` - Body text

### Line Height
- Body: `1.5`
- Headings: Tighter (1.2-1.3)

## Component Hierarchy

### Navigation
- Fixed header with glassmorphism effect
- Logo/Brand name → Nav links → Auth buttons
- Mobile: Hamburger menu with slide-out drawer

### Cards (Recipe Cards)
- Image (aspect 16:9)
- Title (truncate 2 lines)
- Description (truncate 2 lines)
- Tags (max 3 visible)
- Meta info (time, calories)
- Hover: scale + shadow lift

### Forms
- Input fields with dark background
- Clear labels
- Validation messages
- Loading states

## Motion Principles

### Entrance Animations
- **Hero elements**: `fadeInUp` with staggered delays
- **Recipe cards**: Sequential fade-in with stagger

### Micro-interactions
- Button hover: Background color shift
- Card hover: Subtle scale + shadow lift
- Tag/Chip hover: Background change

### Transitions
- Default duration: `200-300ms`
- Easing: `ease-out` for most transitions
- Framer Motion for complex animations

## Glassmorphism

### Navbar
```css
backdrop-blur-md bg-white/5 border-b border-white/10
```

### Cards/Modals
```css
bg-zinc-900/80 backdrop-blur-sm border border-white/10
```

## Responsive Breakpoints

- **Mobile**: < 640px (1 column grid)
- **Tablet**: 640px - 1024px (2 column grid)
- **Desktop**: > 1024px (3 column grid)
