import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function AddressModal({ isOpen, onClose, initialData, onSave, onDelete }) {
  const isEditing = !!initialData

  const [formData, setFormData] = useState({
    label: '',
    address: '',
    isDefault: false
  })

  // Sync initialData to local state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          label: initialData.label || '',
          address: initialData.address || '',
          isDefault: initialData.isDefault || false
        })
      } else {
        setFormData({
          label: '',
          address: '',
          isDefault: false
        })
      }
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

  // iOS-style toggle component
  const Toggle = ({ enabled, onToggle }) => (
    <button 
      type="button"
      onClick={onToggle}
      className={cn(
        "relative w-[51px] h-[31px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        enabled 
          ? "bg-primary shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.04)]" 
          : "bg-muted-foreground/25 dark:bg-muted-foreground/35 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.06)]"
      )}
      role="switch"
      aria-checked={enabled}
    >
      <div className={cn(
        "absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.06)]",
        enabled ? "translate-x-[22px]" : "translate-x-[2px]"
      )} />
    </button>
  )

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
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 space-y-6 no-scrollbar">
          <form id="address-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Label */}
            <div className="space-y-2">
              <label htmlFor="label" className="text-sm font-semibold text-foreground">
                Address Label
              </label>
              <input
                id="label"
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px]"
                placeholder="e.g. Home, Office, Mum's House"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-semibold text-foreground">
                Full Address
              </label>
              <textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full h-24 p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-[15px] resize-none"
                placeholder="123 Main St, Springfield, IL 62701"
              />
            </div>

            {/* Set as Default */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
              <div>
                <span className="font-semibold text-[14px] text-foreground block">Set as Default Address</span>
                <span className="text-[12px] text-muted-foreground">Use this address for future shipments</span>
              </div>
              <Toggle 
                enabled={formData.isDefault} 
                onToggle={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))} 
              />
            </div>

          </form>

          {isEditing && (
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-red-500 font-semibold hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Address
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 shrink-0 bg-card rounded-b-3xl">
          <Button 
            type="submit" 
            form="address-form"
            className="w-full h-12 rounded-xl text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all"
          >
            {isEditing ? 'Save Changes' : 'Add Address'}
          </Button>
        </div>

      </div>
    </div>,
    document.body
  )
}
