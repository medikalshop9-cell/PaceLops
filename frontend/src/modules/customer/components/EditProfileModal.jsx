import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, User, Mail, Phone, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EditProfileModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [activeField, setActiveField] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || ''
      })
      // Stagger the animation
      requestAnimationFrame(() => setIsVisible(true))
    }
    if (!isOpen) {
      setIsVisible(false)
    }
  }, [isOpen, initialData])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    handleClose()
  }

  if (!isOpen) return null

  const fields = [
    { 
      key: 'name', label: 'Full Name', type: 'text', 
      icon: User, placeholder: 'Enter your full name',
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-500'
    },
    { 
      key: 'email', label: 'Email Address', type: 'email', 
      icon: Mail, placeholder: 'Enter your email',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500'
    },
    { 
      key: 'phone', label: 'Phone Number', type: 'tel', 
      icon: Phone, placeholder: 'Enter your phone',
      gradient: 'from-emerald-500/20 to-green-500/20',
      iconColor: 'text-emerald-500'
    },
  ]

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 transition-all duration-300",
          isVisible 
            ? "bg-black/50 backdrop-blur-md" 
            : "bg-black/0 backdrop-blur-none"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
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
            <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">Update your personal information</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {fields.map((field, idx) => {
              const Icon = field.icon
              const isFocused = activeField === field.key
              const hasValue = formData[field.key]?.length > 0

              return (
                <div 
                  key={field.key}
                  className={cn(
                    "group relative rounded-2xl border-2 transition-all duration-300",
                    isFocused 
                      ? "border-primary/50 shadow-[0_0_0_4px] shadow-primary/10" 
                      : hasValue
                        ? "border-border/60 hover:border-border"
                        : "border-border/40 hover:border-border/60"
                  )}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 transition-transform duration-300",
                      field.gradient,
                      isFocused && "scale-110"
                    )}>
                      <Icon className={cn("w-4.5 h-4.5", field.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className={cn(
                        "block text-[11px] font-bold uppercase tracking-wider transition-colors",
                        isFocused ? "text-primary" : "text-muted-foreground"
                      )}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required={field.key !== 'phone'}
                        value={formData[field.key]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        onFocus={() => setActiveField(field.key)}
                        onBlur={() => setActiveField(null)}
                        className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50 mt-0.5"
                        placeholder={field.placeholder}
                      />
                    </div>
                    {hasValue && (
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            <button
              type="submit"
              className="w-full mt-6 h-13 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-[15px] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
