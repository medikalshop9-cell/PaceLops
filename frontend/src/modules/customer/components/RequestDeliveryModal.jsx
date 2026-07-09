import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, MapPin, Home, Building2, Truck, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDeliveryStore } from '../store/useDeliveryStore'
import { useProfileStore } from '../store/useProfileStore'
import { toast } from 'sonner'

export function RequestDeliveryModal({ parcel, isOpen, onClose, onSuccess }) {
  const { requestDelivery } = useDeliveryStore()
  const { savedAddresses } = useProfileStore()
  
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [instructions, setInstructions] = useState('')

  // Pre-select default address
  useEffect(() => {
    if (isOpen && savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0]
      setSelectedAddressId(defaultAddr.id)
    }
  }, [isOpen, savedAddresses, selectedAddressId])

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      const mainContent = document.querySelector('[data-main-scroll]')
      if (mainContent) mainContent.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      const mainContent = document.querySelector('[data-main-scroll]')
      if (mainContent) mainContent.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !parcel) return null

  const handleConfirm = () => {
    if (!selectedAddressId) return
    const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId)
    requestDelivery(parcel.id, selectedAddress?.address || 'Unknown Address', instructions)
    toast.success('Delivery requested successfully!')
    if (onSuccess) onSuccess()
    else onClose()
  }

  const getAddressIcon = (label) => {
    const l = label.toLowerCase()
    if (l.includes('home')) return <Home className="w-4 h-4" />
    if (l.includes('office') || l.includes('work')) return <Building2 className="w-4 h-4" />
    return <MapPin className="w-4 h-4" />
  }

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId)

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden overscroll-y-contain">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border shrink-0">
        <button 
          onClick={onClose} 
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-sm font-bold text-foreground">Request Delivery</h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Current parcel info */}
      <div className="px-4 sm:px-6 py-3 bg-muted/50 border-b border-border shrink-0">
        <p className="text-xs text-muted-foreground flex items-center justify-between">
          <span>Parcel: <span className="font-bold text-foreground">{parcel.trackingNumber}</span></span>
          <span className="font-semibold text-foreground">{parcel.weight}</span>
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="absolute inset-0 top-[6.25rem] bottom-[4.5rem] overflow-y-auto overscroll-y-contain">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">

          {/* Step 1: Address Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">1</span>
                <h3 className="text-sm font-bold text-foreground">Delivery Address</h3>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline">
                Add New
              </button>
            </div>

            <div className="space-y-3">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left",
                      isSelected 
                        ? "bg-primary/10 ring-2 ring-primary shadow-sm" 
                        : "bg-card premium-shadow hover:bg-accent"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {getAddressIcon(addr.label)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("font-bold text-sm", isSelected ? "text-primary" : "text-foreground")}>
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {addr.address}
                      </p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center mt-2.5 transition-all shrink-0",
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "border-2 border-muted-foreground/20"
                    )}>
                      {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">2</span>
              <h3 className="text-sm font-bold text-foreground">Delivery Instructions (Optional)</h3>
            </div>
            
            <textarea 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Leave at front door, call when arrived..."
              className="w-full h-24 p-4 bg-card border border-border rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none premium-shadow"
            />
          </div>

        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl font-semibold text-sm"
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none transition-all flex items-center gap-2 justify-center"
            disabled={!selectedAddressId}
            onClick={handleConfirm}
          >
            <Truck className="w-4 h-4" />
            <span>{selectedAddress ? `Deliver to ${selectedAddress.label}` : 'Confirm'}</span>
          </Button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
