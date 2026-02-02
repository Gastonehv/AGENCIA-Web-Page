# AG RULES: CODING STANDARDS

## GENERAL
1.  **Language:** English only in code (variables, comments, commits). Content strings can be Spanish.
2.  **Types:** No `any`. Define interfaces for all props.
3.  **Naming:**
    - Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
    - Hooks: `camelCase.ts` (e.g., `useScroll.ts`)
    - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_WIDTH`)

## CSS / TAILWIND
1.  Use `clsx` or `cn` (shadcn utility) for conditional classes.
2.  Don't use `@apply` unless creating a reusable typography class.
3.  Mobile-first: `w-full md:w-1/2`.

## FILE STRUCTURE
```
src/
  components/
    ui/          # Dumb components (buttons, cards)
    layout/      # Structure (header, footer)
    canvas/      # R3F specific components
  hooks/         # Custom hooks
  store/         # Zustand stores
  utils/         # Helpers
  app/           # Pages (Next.js) or Routes
```

## COMMIT CONVENTION
- `feat:` New feature
- `fix:` Bug fix
- `style:` Visual changes only (CSS, spacing)
- `refactor:` Code cleanup without logic change
- `docs:` Documentation updates
