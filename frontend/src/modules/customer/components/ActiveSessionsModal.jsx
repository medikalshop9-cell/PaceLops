import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Laptop, Smartphone, Globe, Monitor, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ActiveSessionsModal({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const ua = navigator.userAgent
      let device = 'Unknown Device'
      let browser = 'Unknown Browser'
      let icon = Globe
      let os = 'Unknown OS'

      // Detect OS
      if (/mac/i.test(ua)) os = 'macOS'
      else if (/windows/i.test(ua)) os = 'Windows'
      else if (/linux/i.test(ua)) os = 'Linux'
      else if (/android/i.test(ua)) os = 'Android'
      else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'

      // Detect device type
      if (/mobile/i.test(ua)) {
        device = /iphone|ipad|ipod/i.test(ua) ? 'iPhone' : 'Android Phone'
        icon = Smartphone
      } else {
        device = /mac/i.test(ua) ? 'MacBook' : /windows/i.test(ua) ? 'Windows PC' : 'Desktop'
        icon = Laptop
      }

      // Detect browser
      if (/edg/i.test(ua)) browser = 'Microsoft Edge'
      else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome'
      else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox'
      else if (/safari/i.test(ua)) browser = 'Apple Safari'
      else if (/opera|opr/i.test(ua)) browser = 'Opera'

      setSessions([
        {
          id: 'current',
          device,
          browser,
          os,
          isCurrent: true,
          icon,
          lastActive: 'Active now',
          ip: '•••.•••.•.••'
        }
      ])

      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 250)
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div 
        className={cn(
          "fixed inset-0 transition-all duration-300",
          isVisible ? "bg-black/50 backdrop-blur-md" : "bg-black/0 backdrop-blur-none"
        )}
        onClick={handleClose}
      />

      <div 
        className={cn(
          "w-full max-w-md relative z-10 transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          isVisible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-8 opacity-0 scale-[0.96]"
        )}
      >
        <div className="mx-2 sm:mx-0 bg-card/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] border border-border/30 overflow-hidden">
          
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <div className="absolute top-4 right-4">
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Active Sessions</h2>
                <p className="text-sm text-muted-foreground">Devices logged into your account</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {sessions.map(session => {
              const Icon = session.icon
              return (
                <div 
                  key={session.id} 
                  className="relative overflow-hidden rounded-2xl border-2 border-border/40 bg-background/30"
                >
                  {/* Current session indicator strip */}
                  {session.isCurrent && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
                  )}
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[15px] text-foreground">{session.device}</span>
                          </div>
                          <p className="text-[13px] text-muted-foreground">{session.browser}</p>
                        </div>
                      </div>
                      {session.isCurrent && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-green-600 dark:text-green-400">This Device</span>
                        </div>
                      )}
                    </div>

                    {/* Session details grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'OS', value: session.os },
                        { label: 'Status', value: session.lastActive },
                        { label: 'IP', value: session.ip },
                      ].map(detail => (
                        <div key={detail.label} className="px-3 py-2 rounded-xl bg-muted/40">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">{detail.label}</span>
                          <span className="text-[12px] font-semibold text-foreground">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}

            {sessions.length <= 1 && (
              <div className="flex flex-col items-center py-4 gap-2">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Only this device is currently signed in
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
