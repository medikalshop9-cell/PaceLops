import React, { useState } from 'react'
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Bell, 
  LogOut, 
  Smartphone, 
  ChevronRight, 
  Home, 
  Building2, 
  Plus, 
  Key,
  MessageSquare,
  Mail,
  Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfileStore } from '../store/useProfileStore'
import { ProfileSection } from '../components/ProfileSection'
import { EditProfileModal } from '../components/EditProfileModal'
import { AddressModal } from '../components/AddressModal'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import { ActiveSessionsModal } from '../components/ActiveSessionsModal'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { 
    personalInfo, 
    savedAddresses, 
    security, 
    notifications, 
    toggleNotification,
    toggleMFA,
    updatePersonalInfo,
    addAddress,
    editAddress,
    removeAddress
  } = useProfileStore()
  
  const { user, setUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // New Modals State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const getAddressIcon = (label) => {
    const l = label.toLowerCase()
    if (l.includes('home')) return <Home className="w-4 h-4" />
    if (l.includes('office') || l.includes('work')) return <Building2 className="w-4 h-4" />
    return <MapPin className="w-4 h-4" />
  }

  const displayName = user?.full_name || personalInfo.name
  const displayEmail = user?.email || personalInfo.email
  const initials = displayName?.split(' ').map(n => n[0]).join('')?.toUpperCase() || 'U'

  const handleSaveProfile = (newData) => {
    // Update local profile store
    updatePersonalInfo({
      name: newData.name,
      email: newData.email,
      phone: newData.phone
    })

    // Update global auth store if logged in
    if (user) {
      setUser({
        ...user,
        full_name: newData.name,
        email: newData.email
      })
    }

    toast.success('Profile updated successfully')
  }

  const handleNotificationToggle = (key) => {
    toggleNotification(key)
    toast.success(`${key.toUpperCase()} notifications updated`)
  }

  const handleMFAToggle = () => {
    toggleMFA()
    toast.success(`Two-Factor Authentication ${!security.mfaEnabled ? 'enabled' : 'disabled'}`)
  }

  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      editAddress(editingAddress.id, addressData)
      toast.success('Address updated successfully')
    } else {
      addAddress(addressData)
      toast.success('Address added successfully')
    }
  }

  const handleDeleteAddress = () => {
    if (editingAddress) {
      removeAddress(editingAddress.id)
      toast.success('Address deleted')
    }
  }

  const openAddressModal = (address = null) => {
    setEditingAddress(address)
    setIsAddressModalOpen(true)
  }

  const handleChangePassword = (data) => {
    toast.success('Password changed successfully')
  }

  // Premium modern toggle component
  const Toggle = ({ enabled, onToggle }) => (
    <button 
      onClick={onToggle}
      className={cn(
        "relative w-[52px] h-[32px] rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        enabled 
          ? "bg-gradient-to-r from-primary to-primary/85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_12px_-2px] shadow-primary/40" 
          : "bg-muted-foreground/20 dark:bg-muted-foreground/30 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
      )}
      role="switch"
      aria-checked={enabled}
    >
      <div className={cn(
        "absolute top-[3px] w-[26px] h-[26px] rounded-full bg-white transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.08)]",
        enabled ? "translate-x-[23px]" : "translate-x-[3px]"
      )}>
        {/* Inner shine */}
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-b from-white to-gray-50" />
      </div>
    </button>
  )

  return (
    <div className="py-6 pb-24 space-y-8 animate-scale-up max-w-2xl mx-auto px-4 sm:px-6">
      
      {/* Hero Avatar Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/8 via-card to-card border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.15)]">
        {/* Subtle decorative gradient orb */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col items-center py-10 px-6">
          {/* Avatar with camera overlay */}
          <div className="relative group cursor-pointer mb-5">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-primary/5 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <Avatar className="relative w-24 h-24 ring-[3px] ring-white dark:ring-card shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-[1.03]">
              <AvatarImage 
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${displayName}`} 
                alt={displayName} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center ring-[3px] ring-white dark:ring-card shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{displayName}</h2>
          <p className="text-sm text-muted-foreground mt-1">{displayEmail}</p>
          
          {/* Membership badge */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Active Member</span>
          </div>
        </div>
      </section>

      {/* Personal Info */}
      <ProfileSection title="Personal Information" icon={User}>
        {[
          { label: 'Full Name', value: personalInfo.name },
          { label: 'Email Address', value: personalInfo.email },
          { label: 'Phone Number', value: personalInfo.phone },
        ].map((field, i) => (
          <div 
            key={field.label} 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-between px-5 py-4 hover:bg-accent/40 active:bg-accent/60 transition-colors duration-150 cursor-pointer group"
          >
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">{field.label}</span>
              <p className="font-medium text-[15px] text-foreground truncate">{field.value}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 ml-3" />
          </div>
        ))}
      </ProfileSection>

      {/* Saved Addresses */}
      <ProfileSection title="Saved Addresses" description="Manage delivery and pickup locations." icon={MapPin}>
        {savedAddresses.map((addr) => (
          <div 
            key={addr.id} 
            onClick={() => openAddressModal(addr)}
            className="flex items-center gap-4 px-5 py-4 hover:bg-accent/40 active:bg-accent/60 transition-colors duration-150 cursor-pointer group"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              addr.isDefault 
                ? "bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10" 
                : "bg-muted text-muted-foreground"
            )}>
              {getAddressIcon(addr.label)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-[14px] text-foreground">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">Default</span>
                )}
              </div>
              <p className="text-[13px] text-muted-foreground line-clamp-1 leading-relaxed">
                {addr.address}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
          </div>
        ))}
        <button 
          onClick={() => openAddressModal(null)}
          className="w-full flex items-center justify-center gap-2 px-5 py-4 text-[14px] font-semibold text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </ProfileSection>

      {/* Security */}
      <ProfileSection title="Security" icon={ShieldCheck}>
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/40 active:bg-accent/60 transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-medium text-[15px] text-foreground">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </button>
        
        <div className="flex items-center justify-between px-5 py-4 hover:bg-accent/40 transition-colors duration-150">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <span className="font-medium text-[15px] text-foreground block">Two-Factor Auth</span>
              <span className="text-[12px] text-muted-foreground leading-none">Extra layer of security</span>
            </div>
          </div>
          <Toggle enabled={security.mfaEnabled} onToggle={handleMFAToggle} />
        </div>

        <button 
          onClick={() => setIsSessionsModalOpen(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/40 active:bg-accent/60 transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <div className="text-[11px] font-extrabold text-purple-500 tabular-nums">{security.activeSessions}</div>
            </div>
            <span className="font-medium text-[15px] text-foreground">Active Sessions</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-500/8 active:bg-red-500/12 transition-colors duration-150"
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-medium text-[15px] text-red-500">Log Out From All Devices</span>
        </button>
      </ProfileSection>

      {/* Notifications */}
      <ProfileSection title="Notification Preferences" icon={Bell}>
        {[
          { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { key: 'push', label: 'Push Notifications', desc: 'In-app alerts & badges', icon: Bell, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { key: 'email', label: 'Email Notifications', desc: 'Inbox updates & digests', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.key} className="flex items-center justify-between px-5 py-4 hover:bg-accent/40 transition-colors duration-150">
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", item.bg)}>
                  <Icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div>
                  <span className="font-medium text-[15px] text-foreground block">{item.label}</span>
                  <span className="text-[12px] text-muted-foreground leading-none">{item.desc}</span>
                </div>
              </div>
              <Toggle enabled={notifications[item.key]} onToggle={() => handleNotificationToggle(item.key)} />
            </div>
          )
        })}
      </ProfileSection>

      {/* Bottom spacer for mobile */}
      <div className="h-4" />

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: displayName,
          email: displayEmail,
          phone: personalInfo.phone
        }}
        onSave={handleSaveProfile}
      />

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        initialData={editingAddress}
        onSave={handleSaveAddress}
        onDelete={handleDeleteAddress}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleChangePassword}
      />

      <ActiveSessionsModal
        isOpen={isSessionsModalOpen}
        onClose={() => setIsSessionsModalOpen(false)}
      />
    </div>
  )
}
