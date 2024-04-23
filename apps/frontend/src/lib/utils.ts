import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function colorFromString(string: string, saturation = 50, lightness = 75, defaultColor = '#000000') {
  // Check if the string is empty or null or has less then 3 characters
  if (!string) {
    return defaultColor;
  }
  if (string.trim().length < 3) {
    return defaultColor;
  }
  
  // Calculate the hue value based on the first three characters of the string
  const hue = string.charCodeAt(0) * string.charCodeAt(1) * string.charCodeAt(2);

  // Convert the saturation and lightness values from percentages to decimals between 0 and 1
  const s = saturation / 100;
  const l = lightness / 100;

  // Calculate the alpha value
  const a = s * Math.min(l, 1 - l);

  // Calculate the red, green, and blue values
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };

  // Return the hex color code
  const hexCode = `#${f(0)}${f(8)}${f(4)}`;
  return hexCode || defaultColor;
}

export function opacityFromString(string: string, defaultOpacity = 0.5) {
  if (!string) {
    return defaultOpacity;
  }
  if (string.trim().length < 3) {
    return defaultOpacity;
  }
  return (string.charCodeAt(0) * string.charCodeAt(1) * string.charCodeAt(2)) / 1000;
}

export function hexColorWithOpacity(hex: string, opacity: number) {
  return hex + Math.round(opacity * 255).toString(16).padStart(2, '0');
}

export const floatingNavIconClassName =
  'h-4 w-4 text-neutral-500 dark:text-white'
  + ' group-hover:scale-125 group-hover:text-primary'
  + ' duration-300 ease-in-out transition-all';
