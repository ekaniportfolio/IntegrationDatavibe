# DataVibe Storybook Guide
## Component Documentation & Visual Testing

---

## 1. Overview

Storybook provides an isolated environment for developing, documenting, and visually testing UI components. Each component has its own "story" that demonstrates its states and variations.

---

## 2. Story Structure

### File Naming
```
src/stories/ComponentName.stories.tsx
```

### Basic Story Template
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../app/components/ComponentName';

const meta: Meta<typeof ComponentName> = {
    title: 'Components/ComponentName',
    component: ComponentName,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        // default props
    },
};

export const Active: Story = {
    args: {
        isActive: true,
    },
};
```

---

## 3. Component Categories

### Foundation
- `Typography` (Headings, Body, Caption, Label)
- `Colors` (Brand, Surface, Text, Chart palette)
- `Spacing` (4px grid demonstration)

### Atoms
- `Button` (Primary, Secondary, Ghost, Destructive + sizes SM/MD/LG)
- `Badge` (Default, Outline, Priority variants)
- `Input` (Text, Password, Search + validation states)
- `Avatar` (SM, MD, LG + fallback)

### Molecules
- `SmartCard` (Namespace variants: Streaming/Social/Radio)
- `StatCard` (With/without trend indicator)
- `NavItem` (Default, Active, Disabled)

### Organisms
- `Header` (With/without user panel)
- `Sidebar` (Expanded, Collapsed)
- `DashboardGrid` (Streaming, Social, Radio configurations)

---

## 4. Dark Mode Testing

All stories should be testable in both Light and Dark modes:

```tsx
export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    decorators: [
        (Story) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};
```

---

## 5. Namespace Variants

DataVibe components are often "namespace-aware" (Streaming, Social, Radio). Document all variants:

```tsx
export const Streaming: Story = {
    args: { namespace: 'streaming' },
};

export const Social: Story = {
    args: { namespace: 'social' },
};

export const Radio: Story = {
    args: { namespace: 'radio' },
};
```

---

## 6. Animation Stories

For Spatial Flow components, use play functions to demonstrate animations:

```tsx
import { within, userEvent } from '@storybook/testing-library';

export const WithAnimation: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button');
        await userEvent.click(button);
        // Animation plays
    },
};
```

---
---
---

# Guide Storybook DataVibe
## Documentation & Tests Visuels des Composants

---

## 1. Apercu

Storybook fournit un environnement isole pour developper, documenter et tester visuellement les composants UI.

---

## 2. Structure des Stories

### Nommage
```
src/stories/NomComposant.stories.tsx
```

### Categories
- **Fondations** : Typographie, Couleurs, Espacement
- **Atomes** : Button, Badge, Input, Avatar
- **Molecules** : SmartCard, StatCard, NavItem
- **Organismes** : Header, Sidebar, DashboardGrid

---

## 3. Test Mode Sombre

Toutes les stories doivent etre testables en modes Light et Dark.

---

## 4. Variantes Namespace

Documenter les variantes Streaming, Social, Radio pour chaque composant namespace-aware.
