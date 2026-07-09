import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Laptop, Smartphone, Globe, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ActiveSessionsModal({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([])

  // Parse current user agent
  useEffect(() => {
    if (isOpen) {
      // Very basic user agent parser for demonstration (not a full robust parser)
      const ua = navigator.userAgent
      let device = 'Unknown Device'
      let browser = 'Unknown Browser'
      let icon = Globe

      if (/mobile/i.test(ua)) {
        device = /iphone|ipad|ipod/i.test(ua) ? 'iOS Device' : 'Android Device'
        icon = Smartphone
      } else {
        device = /mac/i.test(ua) ? 'Mac' : /windows/i.test(ua) ? 'Windows PC' : 'Linux PC'
        icon = Laptop
      }

      if (/chrome|crios/i.test(ua)) browser = 'Chrome'
      else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
      else if (/safari/i.test(ua)) browser = 'Safari'
      else if (/edge/i.test(ua)) browser = 'Edge'

      setSessions([
        {
          id: 'current',
          device: device,
          browser: browser,
          location: 'Springfield, IL', // Mock location since we can't reliably get this synchronously without geolocating
          isCurrent: true,
          icon: icon,
          lastActive: 'Just now'
        }
      ])
    }
  }, [isOpen])

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal / Bottom Sheet */}
      <div 
        className={cn(
          "w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]",
          "transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-4 sm:opacity-0"
        )}
      >
        {/* iOS Drag Handle (Mobile only) */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Active Sessions</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
          <div className="space-y-4">
            {sessions.map(session => {
              const Icon = session.icon
              return (
                <div key={session.id} className="flex items-start justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-foreground">{session.device}</span>
                        {session.isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-md">Current</span>
                        )}
                      </div>
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        {session.browser} • {session.location}
                      </p>
                      <p className="text-[12px] text-muted-foreground mt-1">
                        Last active: {session.lastActive}
                      </p>
                    </div>
                  </div>
                  
                  {!session.isCurrent && (
                    <button className="text-red-500 hover:text-red-600 text-sm font-semibold p-2 -mr-2">
                      Revoke
                    </button>
                  )}
                </div>
              )
            })}

            {sessions.length === 1 && (
              <p className="text-center text-sm text-muted-foreground pt-4">
                You only have one active session.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}
