import { cx } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }
