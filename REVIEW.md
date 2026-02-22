# Review Checklist

## Constitution Requirements

### Recipe Data
- [x] 10+ recipes in data/recipes.json
- [x] Each recipe has realistic prep/cook time
- [x] Each recipe has calorie information
- [x] Each recipe has complete ingredients list
- [x] Each recipe has step-by-step instructions

### Images
- [x] 3 images per recipe
- [x] All images use next/image with proper props
- [x] All images have alt text
- [x] Image domains configured in next.config.ts

### Video
- [x] YouTube URL for each recipe
- [x] Using youtube-nocookie.com embed format
- [x] Responsive iframe with 16:9 aspect ratio

### Authentication
- [x] NextAuth.js v5 configured
- [x] Google OAuth provider setup
- [x] Credentials provider (email/password)
- [x] Password hashing with bcrypt
- [x] Users stored in data/users.json
- [x] Registration API endpoint

### Route Protection
- [x] /ai route protected by middleware
- [x] Unauthenticated users redirected to login

### AI Ingredient Matching
- [x] matchRecipes() function implemented
- [x] Normalize ingredients function
- [x] Match percentage calculation
- [x] Missing ingredients list
- [x] Sorted by match percentage

### Design & UI
- [x] Dark mode default (zinc-950 background)
- [x] 4-color system (zinc, emerald, amber)
- [x] Glassmorphism navbar
- [x] Framer Motion animations
- [x] Responsive grid layout
- [x] Mobile hamburger menu

### Performance
- [x] Server Components by default
- [x] next/image for all images
- [x] Static params for recipe pages

### Accessibility
- [x] aria-labels on icon buttons
- [x] Focus rings on interactive elements
- [x] Keyboard navigation support

## Verification

### Build
- [ ] `npm run build` completes without errors

### Runtime
- [ ] Homepage loads at /
- [ ] Recipe pages work at /recipes/[slug]
- [ ] Login page at /auth/login
- [ ] Signup page at /auth/signup
- [ ] AI page at /ai (requires auth)
