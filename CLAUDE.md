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

The app is now structured as a multi-page application with proper routing:

### URL Structure
- `/` - Home page (app selection screen)
- `/create` - Event creation page
- `/join` - Event participation page  
- `/results` - Results display page

### Features Implemented
1. **Event Creation Flow**: Hosts create events with multiple specific date/time options
2. **Participant Response Flow**: Participants select from host-provided options
3. **Results Analysis**: Shows which dates have the most availability
4. **Advanced Date/Time Selection UI**: Complex multi-selection interface

## Multiple Date/Time Selection UI Specification

### Core Architecture
The multiple selection UI uses a **dual-layer approach**:
1. **Hidden `<select multiple>` element** - Manages selection state using browser native APIs
2. **Custom visual UI** - Provides rich visual feedback and interactions
3. **Bridge logic** - Synchronizes between DOM state and React state

### Selection Behaviors

#### 1. Normal Click
- **Single selection mode**: Selects only the clicked item, deselects others
- **Toggle behavior**: If already selected, deselects the item (allows zero selection)
- **Implementation**: `option.selected = !option.selected` with others cleared

#### 2. Ctrl+Click (Cmd+Click on Mac)
- **Individual toggle**: Adds/removes single items from selection
- **Preserves existing selection**: Other selected items remain selected
- **Implementation**: `option.selected = !option.selected`

#### 3. Shift+Click
- **Range selection**: Selects all items between last selected and current item
- **Based on last selection**: Uses the most recently selected item as anchor
- **Implementation**: Loop through range and set `option.selected = true`

#### 4. Management Buttons
- **全選択 (Select All)**: Selects all available date options
- **選択解除 (Deselect All)**: Clears all selections
- **選択した候補を削除 (Delete Selected)**: Removes selected items from list

### Visual Feedback
- **Selection indicator**: Custom checkmark icon in blue circle
- **Background color**: `bg-blue-50 border-blue-200` for selected items
- **Hover effect**: `hover:bg-gray-50` for unselected items
- **Smooth transitions**: `transition-colors` for state changes

### Integration Features

#### Calendar Integration
- **No selection**: Calendar clicks add new date options
- **With selection**: Calendar clicks update dates of all selected items
- **Implementation**: `handleCalendarDateSelect` checks `selectedDateOptionIndexes.length`

#### Time Panel Integration  
- **Bulk time assignment**: Selected time applies to all selected date options
- **Form-based time input**: Enter key submits new time options
- **Custom time management**: Add/remove time options with trash can buttons

### Technical Implementation

#### Hidden Select Element
```tsx
<select
  ref={selectRef}
  multiple
  className="sr-only"
  value={selectedDateOptionIndexes.map(String)}
  onChange={onSelectChange}
>
  {dateOptions.map((_, index) => (
    <option key={index} value={index}>{index}</option>
  ))}
</select>
```

#### Selection Logic Bridge
```tsx
const handleDateOptionClick = (index: number, event: React.MouseEvent) => {
  const selectElement = selectRef.current;
  const option = selectElement.options[index];

  if (event.shiftKey) {
    // Range selection logic
  } else if (event.ctrlKey || event.metaKey) {
    // Individual toggle logic  
  } else {
    // Single selection with toggle
  }

  // Sync React state with DOM state
  const selectedOptions = Array.from(selectElement.selectedOptions);
  const selectedIndexes = selectedOptions.map(opt => parseInt(opt.value));
  setSelectedDateOptionIndexes(selectedIndexes);
};
```

#### State Synchronization
- **DOM → React**: `selectedOptions.map(opt => parseInt(opt.value))`
- **React → DOM**: Direct manipulation of `option.selected` properties
- **Consistency**: Always sync React state after DOM operations

### Accessibility Features
- **Screen reader support**: Hidden select element provides semantic structure
- **Keyboard navigation**: Standard focus management for form inputs
- **Visual clarity**: High contrast selection indicators
- **Semantic HTML**: Proper form structure with labels and inputs

### File Organization
- **Component**: `/src/features/create/components/DateOptionsList.tsx`
- **Main logic**: `/src/app/create/page.tsx`
- **Types**: `/src/features/shared/types.ts`
- **Supporting components**: Calendar, TimeSelectionPanel

## Key Files

- `src/app/page.tsx`: Home page with navigation to create/join flows
- `src/app/create/page.tsx`: Event creation page with advanced date/time selection
- `src/app/join/page.tsx`: Event participation page
- `src/app/results/page.tsx`: Results analysis page
- `src/features/create/components/DateOptionsList.tsx`: Multi-selection date/time UI
- `src/features/shared/components/Calendar.tsx`: Calendar component
- `src/features/create/components/TimeSelectionPanel.tsx`: Time selection panel
- `src/app/layout.tsx`: Root layout with Geist font configuration
- `src/app/globals.css`: Global styles with Tailwind CSS
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration with path aliases (`@/*` → `./src/*`)

## TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Strict TypeScript enabled
- Next.js plugin configured for optimal development experience