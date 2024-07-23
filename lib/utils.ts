import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {Resend} from "resend"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


