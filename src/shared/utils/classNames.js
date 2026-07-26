export { default as cn } from 'clsx'
// Re-exported so components do `import { cn } from '@shared/utils/classNames.js'`
// and the underlying className-merging library can be swapped later
// (e.g. to tailwind-merge) without touching every component import.
