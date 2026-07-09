import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function EditProfileModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Sync initialData to local state when modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || ''
      })
    }
  }, [isOpen, initialData])

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

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
          <h2 className="text-xl font-bold text-foreground tracking-tight">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                placeholder="John Doe"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-semibold text-foreground">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                placeholder="+1 234 567 8900"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 shrink-0 bg-card rounded-b-3xl">
          <Button 
            type="submit" 
            form="edit-profile-form"
            className="w-full h-12 rounded-xl text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
          >
            Save Changes
          </Button>
        </div>

      </div>
    </div>,
    document.body
  )
}
