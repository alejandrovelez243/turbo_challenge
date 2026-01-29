---
name: React Frontend Development
description: Best practices for Next.js and React development for this project.
---

# React Frontend Skill

## capabilities
- Create UI Components (Aesthetic).
- Integrate APIs with Types.
- Manage State with React Query.

## instructions

### 1. File Structure
- `src/app/` -> Pages (App Router).
- `src/components/` -> Folder-based reusable components.
  - **Rule**: Every component must have its own folder containing `ComponentName.tsx` and `ComponentName.module.css`.
- `src/services/` -> API calls.
- `src/types/` -> TypeScript interfaces.

### 2. API Integration
**Step A: Define the Type**
Create a `interface` in `src/types/` that matches the Django API response *exactly*.

**Step B: Create the Service**
In `src/services/api/`, create functions that return typed Promises.
```typescript
import { Note } from '@/types';
import { client } from './client'; // axios or fetch wrapper

export const getNotes = async (): Promise<Note[]> => {
    const { data } = await client.get<Note[]>('/notes/');
    return data;
};
```

**Step C: Use the Hook**
Use React Query in components.
```typescript
import { useQuery } from '@tanstack/react-query';
import { getNotes } from '@/services/api/notes';

export const NotesList = () => {
    const { data: notes, isLoading } = useQuery({ queryKey: ['notes'], queryFn: getNotes });
    if (isLoading) return <div>Loading...</div>;
    return <ul>{notes?.map(n => <li key={n.id}>{n.title}</li>)}</ul>;
}
```

### 3. Styling & Design System (Strict)
- **Design Source**: Follow `Note Taking App.pen` EXACTLY.
- **Framework**: Use CSS Modules with Global CSS Variables.
- **Typography**:
  - Headings: `Inria Serif` (Google Font).
  - Body: `Inter` (Google Font).
- **Color Palette (Theme Variables)**:
  - Background: `#faf1e3` (Cream) / `#111111` (Dark)
  - Primary Accent: `#FF8400` (Orange)
  - Text: `#111111` (Dark) / `#F2F3F0` (Light)
  - Cards: Mixed Pastels (Orange `#ef9c6680`, Yellow `#fcdc9480`).
- **Shapes**:
  - Cards: `border-radius: 16px` (`--radius-m`).
  - Buttons: Pill shape (`border-radius: 999px`).
- **Icons**: Use `lucide-react` or similar, ensuring they match the "Iconography - Caesarzkn" style (thin strokes).

### 4. Quality
- Run `npm run lint` to check for issues.
- Ensure no `any` types are used.
- Match UX exactly: "Empty states" must have the specific witty copy from the design.
