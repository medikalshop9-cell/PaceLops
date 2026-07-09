import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ChangePasswordModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPassword({ current: false, new: false, confirm: false })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
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
          <h2 className="text-xl font-bold text-foreground tracking-tight">Change Password</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
          <form id="password-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Current Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-foreground">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                  placeholder="Enter current password"
                />
                <button 
                  type="button" 
                  onClick={() => toggleVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-foreground">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                  placeholder="Enter new password"
                />
                <button 
                  type="button" 
                  onClick={() => toggleVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full h-12 px-4 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                  placeholder="Confirm new password"
                />
                <button 
                  type="button" 
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 shrink-0 bg-card rounded-b-3xl">
          <Button 
            type="submit" 
            form="password-form"
            className="w-full h-12 rounded-xl text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
            disabled={
              !formData.currentPassword || 
              !formData.newPassword || 
              !formData.confirmPassword ||
              (formData.newPassword !== formData.confirmPassword)
            }
          >
            Update Password
          </Button>
        </div>

      </div>
    </div>,
    document.body
  )
}
