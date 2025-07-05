# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "atsumarun" - a Next.js-based scheduling coordination app for multiple people. The app helps users find the best dates when the most people can gather by having event hosts create multiple date/time options and participants select their availability.

## Key Architecture

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS 4.1.11
- **Package Manager**: pnpm (based on pnpm-lock.yaml)
- **Current State**: Basic form prototype for individual availability input

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Current Implementation

The app currently has a single-page form (`src/app/page.tsx`) that collects individual availability:
- Name and email input
- Day-of-week selection (checkbox grid)
- Time slot selection (morning/afternoon/evening/night)
- Meeting duration
- Additional messages

## Required Architecture Changes

Based on the project goals, the current implementation needs significant restructuring:

1. **Event Creation Flow**: Host creates events with multiple specific date/time options
2. **Participant Response Flow**: Participants select from host-provided options
3. **Results Analysis**: Show which dates have the most availability
4. **Data Persistence**: Store events and responses (currently no database)

## Key Files

- `src/app/page.tsx`: Main form component (needs redesign for host/participant flows)
- `src/app/layout.tsx`: Root layout with Geist font configuration
- `src/app/globals.css`: Global styles with Tailwind CSS
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration with path aliases (`@/*` → `./src/*`)

## TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Strict TypeScript enabled
- Next.js plugin configured for optimal development experience