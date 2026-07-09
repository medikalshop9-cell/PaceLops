import React from 'react'
import { cn } from '@/lib/utils'

export function ProfileSection({ title, description, children, icon: Icon }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-1">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shadow-sm ring-1 ring-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
        <div>
          <h3 className="text-[15px] font-bold text-foreground tracking-tight">{title}</h3>
          {description && (
            <p className="text-[13px] text-muted-foreground leading-snug">{description}</p>
          )}
        </div>
      </div>
      
      <div className="bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_14px_rgba(0,0,0,0.15)]">
        <div className="divide-y divide-border/40">
          {children}
        </div>
      </div>
    </div>
  )
}
