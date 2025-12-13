"use client";

import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  function toast({ title, description, variant }: ToastOptions) {
    const message = title ?? "";
    const desc = description ?? "";

    if (variant === "destructive") {
      sonnerToast.error(message || desc, {
        description: message ? desc : undefined,
      });
    } else {
      sonnerToast.success(message || desc, {
        description: message ? desc : undefined,
      });
    }
  }

  return { toast };
}
