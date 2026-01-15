import toast from "react-hot-toast"

let lastToast: string | null = null
let lastToastTime = 0

const TOAST_SUPPRESS_TIME = 3000

function shouldShowToast(message: string): boolean {
  const now = Date.now()
  if (lastToast === message && now - lastToastTime < TOAST_SUPPRESS_TIME) {
    return false
  }
  lastToast = message
  lastToastTime = now
  return true
}

export const notifications = {
  success: (message: string, options?: { action?: { label: string; onClick: () => void } }) => {
    if (!shouldShowToast(message)) return
    toast.dismiss()
    toast.success(message, {
      duration: 4000,
      style: {
        background: "oklch(0.15 0.06 280)",
        color: "oklch(0.95 0.01 280)",
        border: "1px solid oklch(0.25 0.06 280)",
        borderRadius: "8px",
      },
      ...(options?.action && {
        action: {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      }),
    })
  },
  error: (message: string, options?: { action?: { label: string; onClick: () => void } }) => {
    if (!shouldShowToast(message)) return
    toast.dismiss()
    toast.error(message, {
      duration: 5000,
      style: {
        background: "oklch(0.15 0.06 280)",
        color: "oklch(0.95 0.01 280)",
        border: "1px solid oklch(0.55 0.18 25)",
        borderRadius: "8px",
      },
      ...(options?.action && {
        action: {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      }),
    })
  },
  warning: (message: string, options?: { action?: { label: string; onClick: () => void } }) => {
    if (!shouldShowToast(message)) return
    toast.dismiss()
    toast(message, {
      icon: "⚠️",
      duration: 4000,
      style: {
        background: "oklch(0.15 0.06 280)",
        color: "oklch(0.95 0.01 280)",
        border: "1px solid oklch(0.8 0.14 90)",
        borderRadius: "8px",
      },
      ...(options?.action && {
        action: {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      }),
    })
  },
  info: (message: string, options?: { action?: { label: string; onClick: () => void } }) => {
    if (!shouldShowToast(message)) return
    toast.dismiss()
    toast(message, {
      icon: "ℹ️",
      duration: 4000,
      style: {
        background: "oklch(0.15 0.06 280)",
        color: "oklch(0.95 0.01 280)",
        border: "1px solid oklch(0.75 0.18 140)",
        borderRadius: "8px",
      },
      ...(options?.action && {
        action: {
          label: options.action.label,
          onClick: options.action.onClick,
        },
      }),
    })
  },
}

