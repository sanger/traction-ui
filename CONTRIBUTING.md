# Contributing to Traction UI

Thank you for your interest in contributing to Traction UI! This guide provides coding standards and best practices to maintain consistency and code quality across the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Code Style and Formatting](#code-style-and-formatting)
- [Frontend Standards](#frontend-standards)
- [Testing Standards](#testing-standards)
- [Git Workflow](#git-workflow)
- [Performance Best Practices](#performance-best-practices)
- [Accessibility Guidelines](#accessibility-guidelines)

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm (installed with Node.js)

We recommend using [nvm](https://github.com/nvm-sh/nvm) for managing Node.js versions:

```bash
nvm use
npm install --include=dev
```

### Environment Configuration

Before running the development server, you need to configure environment variables. This project uses Vite and requires specific environment variables to connect to backend services.

Create a `.env.development.local` file in the project root:

```bash
VITE_TRACTION_BASE_URL=<url>
VITE_PRINTMYBARCODE_BASE_URL=<url>
VITE_LOG=false
```

**Required variables:**
- `VITE_TRACTION_BASE_URL` - Base URL for the Traction API backend
- `VITE_PRINTMYBARCODE_BASE_URL` - Base URL for the PrintMyBarcode service
- `VITE_LOG` - Enable/disable logging (set to `false` for development)

Replace `<url>` placeholders with the appropriate backend URLs for your development environment.

For detailed configuration options and environment-specific setup, see the [README](README.md#configuring-environment).

### Development Workflow

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally
3. **Create a feature branch** from `develop`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the standards below
5. **Test your changes** thoroughly
6. **Submit a pull request** to the `develop` branch

## Code Style and Formatting

### Prettier Configuration

This project uses Prettier for consistent code formatting. Our configuration:

- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **Line length**: 100 characters (`printWidth: 100`)
- **Trailing commas**: Always (`trailingComma: 'all'`)
- **Arrow function parentheses**: Always (`arrowParens: 'always'`)

**Check formatting:**
```bash
npm run pretty
```

**Auto-fix formatting:**
```bash
npx prettier --write .
```

### ESLint Configuration

We use ESLint for code quality and Vue.js best practices.

**Run linting:**
```bash
npm run lint
```

**Auto-fix linting issues:**
```bash
npm run lint -- --fix
```

### Import Organization

Organize imports in the following order:

1. Vue core imports (`vue`, `vue-router`, `pinia`)
2. External libraries
3. Internal aliases (`@/components`, `@/stores`, etc.)
4. Relative imports

**Example:**
```javascript
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import someLibrary from 'some-library'
import MyComponent from '@/components/MyComponent.vue'
import useRootStore from '@/stores'
import { helperFunction } from './helpers'
```

## Frontend Standards

### File and Component Naming

- **Vue Components**: Use PascalCase for file names
  - ✅ `TractionMessage.vue`
  - ✅ `PacbioPoolEdit.vue`
  - ❌ `tractionMessage.vue`
  - ❌ `pacbio-pool-edit.vue`

- **JavaScript Files**: Use camelCase
  - ✅ `requestHelpers.js`
  - ✅ `dataHelpers.js`

- **Component Usage in Templates**: Use kebab-case
  ```vue
  <!-- Correct -->
  <traction-message :message="msg" />
  
  <!-- Avoid -->
  <TractionMessage :message="msg" />
  ```

### Folder Structure

The project follows a feature-based organization:

```
src/
├── api/          # API client and request builders
├── components/   # Reusable Vue components
├── composables/  # Vue composition functions
├── config/       # Configuration files
├── lib/          # Utility libraries and helpers
├── services/     # Business logic and services
├── stores/       # Pinia state management
├── views/        # Route-level components
└── styles/       # Global styles
```

**Component Organization:**

- Group related components in subdirectories (e.g., `components/pacbio/`, `components/ont/`)
- Keep components focused and single-purpose
- Extract reusable logic into composables

### Component Structure

Use the `<script setup>` pattern for all new components:

```vue
<template>
  <div>
    <!-- Template content -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})

// Emits
const emit = defineEmits(['update', 'close'])

// Reactive state
const isVisible = ref(true)

// Computed properties
const displayMessage = computed(() => props.message.toUpperCase())

// Methods
function handleClose() {
  emit('close')
}
</script>

<style scoped>
/* Component-specific styles */
</style>
```

**Component Order:**
1. `<template>`
2. `<script setup>` or `<script>`
3. `<style>` (optional)

### Props and Emits

**Define Props with Validation:**

```javascript
const props = defineProps({
  // Required prop with type
  id: {
    type: String,
    required: true,
  },
  
  // Optional prop with default
  type: {
    type: String,
    default: 'primary',
  },
  
  // Type validation
  items: {
    type: Array,
    default: () => [],
  },
})
```

**Declare Emits Explicitly:**

```javascript
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])
```

### State Management (Pinia)

- Store files are located in `src/stores/`
- Use composition API style for stores
- Keep stores focused on specific domains

**Example Store Pattern:**

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMyStore = defineStore('myStore', () => {
  // State
  const items = ref([])
  
  // Getters
  const itemCount = computed(() => items.value.length)
  
  // Actions
  function addItem(item) {
    items.value.push(item)
  }
  
  return { items, itemCount, addItem }
})
```

### Composables

- Located in `src/composables/`
- Prefix with `use` (e.g., `useAlert`, `useModalHelper`)
- Return reactive values and methods
- Reuse logic across components

**Example:**

```javascript
export default function useAlert() {
  const rootStore = useRootStore()
  
  function showAlert(message, type = 'success') {
    rootStore.addMessage({ message, type })
  }
  
  return { showAlert }
}
```

## Testing Standards

### Unit Tests

**File Naming and Location:**
- Unit tests are located in `tests/unit/`
- Mirror the source structure
- Use `.spec.js` extension
  - Component: `src/components/TractionMessage.vue`
  - Test: `tests/unit/components/TractionMessage.spec.js`

**Test Structure:**

```javascript
import { mount } from '@support/testHelper'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent.vue', () => {
  let wrapper
  
  // Setup common test data
  const defaultProps = {
    message: 'Test message',
  }
  
  it('renders props correctly', () => {
    wrapper = mount(MyComponent, {
      props: defaultProps,
    })
    
    expect(wrapper.vm.message).toBe('Test message')
  })
  
  it('emits event on button click', () => {
    wrapper = mount(MyComponent, {
      props: defaultProps,
    })
    
    wrapper.find('[data-attribute="button"]').trigger('click')
    expect(wrapper.emitted('clicked')).toBeTruthy()
  })
})
```

**Running Tests:**

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm run test:unit tests/unit/components/MyComponent.spec.js

# Run specific test by name
npm run test:unit tests/unit/components/MyComponent.spec.js -t "test name"
```

### End-to-End Tests

**Location:** `tests/e2e/`

**Running E2E Tests:**

```bash
# Run all e2e tests
npm run test:e2e:all

# Open Cypress interactive mode
npm run test:e2e:one

# Run specific spec file
npm run test:cypress:all -- --spec **/mySpec.cy.js
```

### Testing Best Practices

- **Use descriptive test names** that explain what is being tested
- **Use `data-attribute` or `data-testid`** for selecting elements in tests
- **Test user interactions**, not implementation details
- **Mock external dependencies** (API calls, stores)
- **Aim for meaningful coverage** rather than 100% coverage
- **Test edge cases** and error states

**Example of testable markup:**

```vue
<template>
  <button data-testid="submit-button" @click="handleSubmit">
    Submit
  </button>
</template>
```

## Git Workflow

### Branch Naming Conventions

Use descriptive branch names with the following prefixes:

- `feature/` - New features
  - Example: `feature/add-pool-editing`
  
- `bugfix/` - Bug fixes
  - Example: `bugfix/fix-validation-error`
  
- `refactor/` - Code refactoring
  - Example: `refactor/extract-common-component`
  
- `docs/` - Documentation changes
  - Example: `docs/update-api-guide`
  
- `test/` - Test-related changes
  - Example: `test/add-pool-tests`

### Commit Message Format

Follow conventional commit format:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat: add pool library editing functionality

fix: resolve validation error on empty input

docs: add coding standards to CONTRIBUTING.md

test: add unit tests for TractionMessage component
```

### Pull Request Guidelines

**PR Title:** Use the same format as commit messages

**PR Description should include:**
- **Summary** of changes
- **Reference to related issues** (e.g., "Fixes #123" or "Relates to #456")
- **Type of change** (feature, bugfix, documentation, etc.)
- **Testing performed**
- **Breaking changes** (if any)

**Example PR Description:**

```markdown
## Summary
Add comprehensive coding standards to improve maintainability

## Related Issue
Fixes #606

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [x] Documentation update
- [ ] Breaking change

## Testing
- Verified markdown formatting with `npm run pretty`
- Reviewed documentation for clarity and accuracy

## Notes
Documentation-only change, no application logic modified.
```

## Performance Best Practices

### Computed Properties vs Methods

- **Use computed properties** for derived state that should be cached
- **Use methods** for actions or operations with side effects

```javascript
// Good - cached and reactive
const filteredItems = computed(() => 
  items.value.filter((item) => item.active)
)

// Avoid - recalculates on every access
function filteredItems() {
  return items.value.filter((item) => item.active)
}
```

### Component Lazy Loading

Lazy load route-level components to reduce initial bundle size:

```javascript
// router.js
const routes = [
  {
    path: '/pacbio/runs',
    name: 'PacbioRuns',
    component: () => import('@/views/PacbioRuns.vue'),
  },
]
```

### Avoiding Unnecessary Re-renders

- **Use `v-show` for frequent visibility toggles** (keeps element in DOM)
- **Use `v-if` for conditional rendering** (removes from DOM)
- **Avoid inline functions in templates** when possible

```vue
<!-- Good - method reference -->
<button @click="handleClick">Click</button>

<!-- Avoid - creates new function on each render -->
<button @click="() => doSomething(item)">Click</button>
```

### Proper Use of Reactivity

- **Avoid mutating props directly**
- **Use computed properties** for transformations
- **Destructure with caution** - destructured props lose reactivity

```javascript
// Good - maintains reactivity
const message = computed(() => props.message)

// Avoid - loses reactivity
const { message } = props
```

## Accessibility Guidelines

### Semantic HTML

Use semantic HTML elements for better accessibility:

```vue
<!-- Good -->
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<!-- Avoid -->
<div class="nav">
  <div class="link">Home</div>
</div>
```

### ARIA Attributes

Use ARIA attributes when semantic HTML is insufficient:

```vue
<button 
  aria-label="Close dialog"
  @click="closeDialog"
>
  ×
</button>

<div 
  role="alert" 
  aria-live="polite"
>
  {{ alertMessage }}
</div>
```

### Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

- Use native button and anchor elements when possible
- Provide keyboard event handlers for custom controls
- Maintain logical tab order
- Provide visible focus indicators

### Form Accessibility

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <label for="username">Username</label>
    <input 
      id="username" 
      v-model="username"
      type="text"
      required
      aria-required="true"
    />
    
    <span 
      v-if="error" 
      role="alert"
      class="error"
    >
      {{ error }}
    </span>
  </form>
</template>
```

## CSS and Styling

### Tailwind CSS

This project uses [Tailwind CSS](https://tailwindcss.com/) via the `@sanger/ui-styling` module.

**Modify Tailwind configuration** in `tailwind.config.js` for project-specific needs.

**Generate CSS:**
```bash
npm run serve:css
```

### Styling Best Practices

- **Prefer Tailwind utility classes** for styling
- **Use scoped styles** for component-specific CSS
- **Extract common patterns** into reusable components
- **Follow responsive design** principles (mobile-first)

```vue
<template>
  <!-- Tailwind utilities -->
  <div class="flex flex-col px-4 py-2 bg-white rounded-md shadow">
    <h2 class="text-lg font-semibold">Title</h2>
  </div>
</template>

<style scoped>
/* Component-specific styles when Tailwind is insufficient */
.custom-gradient {
  background: linear-gradient(to right, #667eea, #764ba2);
}
</style>
```

## Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Cypress Documentation](https://www.cypress.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Questions or Issues?

If you have questions about these standards or need clarification, please:
- Open an issue in the repository
- Reach out to the maintainers
- Check existing pull requests for examples

Thank you for contributing to Traction UI!
