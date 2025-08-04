# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application with TypeScript, built for FIAP as "Rede Âncora" - a budget management application. The project uses:

- **Framework**: Next.js 15.4.4 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Language**: TypeScript with strict mode
- **Font**: Manrope (custom) + Geist (fallback)

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### File Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/src/app/ui/` - Reusable UI components organized by type:
  - `buttons/` - Button components
  - `headers/` - Header components  
  - `inputs/` - Form input components
  - `keyboards/` - Custom keyboard components

### Component Structure
- All UI components are client-side (`'use client'`)
- Components follow TypeScript with proper prop typing
- Consistent naming: PascalCase for components, camelCase for props
- Components are self-contained with default props where appropriate

### Design System
The app uses a custom design system with predefined tokens in `globals.css`:

### Mobile-First Design
- Max width constrained to 360px (mobile viewport)
- Components sized for mobile interaction (48px button height, 20px border radius)
- Custom keyboard component for mobile input experience

## Key Patterns

1. **State Management**: Local useState for component state, no global state library currently
2. **Styling**: Tailwind utility classes with design system color variables
3. **Component Props**: TypeScript interfaces with optional props and sensible defaults
4. **Event Handling**: Explicit handler functions passed as props (onClose, onClick, etc.)

## Path Aliases
- `@/*` maps to `./src/*` for cleaner imports

## Multi-Step Flow System

The application now uses a componentized multi-step flow system:

### Core Components
- **InputScreen** (`/src/app/ui/screens/`) - Reusable screen template with native input
- **useStepFlow** (`/src/app/hooks/`) - Hook for managing step navigation and data
- **BackButton** (`/src/app/ui/buttons/`) - Navigation back button with arrow icon
- **TextInput** (`/src/app/ui/inputs/`) - Enhanced input component with native keyboard support

### Step Configuration
Steps are configured in `/src/app/config/` with typed configurations:
- `budgetSteps.ts` - Budget creation flow (4 steps)
- `onboardingSteps.ts` - User onboarding flow (3 steps) 
- `profileSteps.ts` - Profile editing flow (3 steps)

### Available Pages
- `/budget` - Multi-step budget creation with name, description, value, category
- `/onboarding` - User registration flow with name, company, phone
- `/profile` - Profile editing with name, email, bio (pre-filled data)
- `/product` - Product creation with name, description, price, unit

### Navigation Features
- Back button appears when `allowBack: true` in step config
- Data persists when navigating between steps
- Validation per step with custom rules
- Progress tracking and completion callbacks

### Current Application State
The application now supports dynamic multi-step flows with consistent UX patterns. Each flow can be easily configured and extended by adding new step definitions.

