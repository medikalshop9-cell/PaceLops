import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, EyeOff, Lock, ShieldCheck, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChangePasswordModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false, new: false, confirm: false
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPassword({ current: false, new: false, confirm: false })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    handleClose()
  }

  // Password strength calculation
  const strength = useMemo(() => {
    const pw = formData.newPassword
    if (!pw) return { level: 0, label: '', color: '' }
    
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' }
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-orange-500' }
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-yellow-500' }
    if (score <= 4) return { level: 4, label: 'Strong', color: 'bg-emerald-500' }
    return { level: 5, label: 'Excellent', color: 'bg-green-500' }
  }, [formData.newPassword])

  const passwordsMatch = formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword
  const passwordsMismatch = formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword

  if (!isOpen) return null

  const passwordFields = [
    { 
      key: 'current', field: 'currentPassword', 
      label: 'Current Password', placeholder: 'Enter current password',
      icon: Lock, gradient: 'from-slate-500/20 to-gray-500/20', iconColor: 'text-slate-500'
    },
    { 
      key: 'new', field: 'newPassword', 
      label: 'New Password', placeholder: 'Create a strong password',
      icon: ShieldCheck, gradient: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-500'
    },
    { 
      key: 'confirm', field: 'confirmPassword', 
      label: 'Confirm Password', placeholder: 'Confirm new password',
      icon: Check, gradient: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-500'
    }
  ]

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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Change Password</h2>
                <p className="text-sm text-muted-foreground">Keep your account secure</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {passwordFields.map((pf) => {
              const Icon = pf.icon
              return (
                <div key={pf.key} className="space-y-2">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                    {pf.label}
                  </label>
                  <div className="relative flex items-center rounded-2xl border-2 border-border/40 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px] focus-within:shadow-primary/10 transition-all duration-300 bg-background/50">
                    <div className={cn("ml-3 w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", pf.gradient)}>
                      <Icon className={cn("w-4 h-4", pf.iconColor)} />
                    </div>
                    <input
                      type={showPassword[pf.key] ? 'text' : 'password'}
                      required
                      value={formData[pf.field]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [pf.field]: e.target.value }))}
                      className="flex-1 h-13 px-3 bg-transparent border-none outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50"
                      placeholder={pf.placeholder}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(prev => ({ ...prev, [pf.key]: !prev[pf.key] }))}
                      className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors mr-1"
                    >
                      {showPassword[pf.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength meter for new password */}
                  {pf.key === 'new' && formData.newPassword && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div 
                            key={i} 
                            className={cn(
                              "h-1 flex-1 rounded-full transition-all duration-500",
                              i <= strength.level ? strength.color : "bg-muted"
                            )} 
                          />
                        ))}
                      </div>
                      <p className={cn(
                        "text-[11px] font-semibold",
                        strength.level <= 1 ? "text-red-500" 
                          : strength.level <= 2 ? "text-orange-500" 
                          : strength.level <= 3 ? "text-yellow-500" 
                          : "text-emerald-500"
                      )}>
                        {strength.label}
                      </p>
                    </div>
                  )}

                  {/* Match/mismatch indicator for confirm */}
                  {pf.key === 'confirm' && formData.confirmPassword && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {passwordsMatch ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px] font-semibold text-emerald-500">Passwords match</span>
                        </>
                      ) : passwordsMismatch ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                          <span className="text-[11px] font-semibold text-red-500">Passwords don't match</span>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            })}

            <button
              type="submit"
              disabled={!formData.currentPassword || !passwordsMatch}
              className={cn(
                "w-full mt-4 h-13 rounded-2xl font-bold text-[15px] transition-all duration-200",
                formData.currentPassword && passwordsMatch
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
