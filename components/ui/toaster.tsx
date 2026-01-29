'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  const topToasts = toasts.filter(t => t.position === 'top' || !t.position)
  const centerToasts = toasts.filter(t => t.position === 'center')

  return (
    <ToastProvider>
      {/* Top positioned toasts (default) */}
      {topToasts.map(function ({ id, title, description, action, position, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport position="top" />

      {/* Center positioned toasts */}
      {centerToasts.map(function ({ id, title, description, action, position, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport position="center" />
    </ToastProvider>
  )
}
