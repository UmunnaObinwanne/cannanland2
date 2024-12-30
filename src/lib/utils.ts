import DOMPurify from 'isomorphic-dompurify';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'blockquote', 'code', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}
