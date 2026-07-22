import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Trash2, MapPin, Tag, Star, Check, Navigation, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Map, MapMarker, MarkerContent, MapControls } from '@/components/ui/map'

const satelliteMapStyle = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Esri, Maxar'
    }
  },
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22
    }
  ]
}

export function AddressModal({ isOpen, onClose, initialData, onSave, onDelete }) {
  const isEditing = !!initialData
  const [formData, setFormData] = useState({ label: '', address: '', isDefault: false })
  const [isVisible, setIsVisible] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [tempCoords, setTempCoords] = useState([-0.2057, 5.556])
  const [searchQuery, setSearchQuery] = useState('')
  const mapRef = React.useRef(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          label: initialData.label || '',
          address: initialData.address || '',
          isDefault: initialData.isDefault || false
        })
      } else {
        setFormData({ label: '', address: '', isDefault: false })
      }
      setShowDeleteConfirm(false)
      setIsMapOpen(false)
      setSearchQuery('')
      setTempCoords([-0.2057, 5.556])
      requestAnimationFrame(() => setIsVisible(true))
    } else {
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

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete()
      handleClose()
    } else {
      setShowDeleteConfirm(true)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported')
      return
    }
    
    toast.loading('Getting your location...', { id: 'gps' })
    navigator.geolocation.getCurrentPosition(async (position) => {
      const coords = [position.coords.longitude, position.coords.latitude]
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`)
        const data = await res.json()
        if (data && data.display_name) {
          setFormData(prev => ({ ...prev, address: data.display_name }))
          setTempCoords(coords)
          toast.success('Location updated successfully!', { id: 'gps' })
        } else {
          toast.success('GPS coordinates saved!', { id: 'gps' })
        }
      } catch (err) {
        toast.error('Could not fetch address.', { id: 'gps' })
      }
    }, () => {
      toast.error('Unable to retrieve your location', { id: 'gps' })
    })
  }

  const handleMapSearch = async () => {
    if (!searchQuery) return
    
    toast.loading('Searching...', { id: 'map-search' })
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`)
      const data = await res.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const lng = parseFloat(lon)
        const lti = parseFloat(lat)
        setTempCoords([lng, lti])
        mapRef.current?.flyTo({ center: [lng, lti], zoom: 16, essential: true })
        toast.success('Location found! Drag the pin for precise placement.', { id: 'map-search' })
      } else {
        toast.error('Location not found', { id: 'map-search' })
      }
    } catch (err) {
      toast.error('Search failed', { id: 'map-search' })
    }
  }

  const handleConfirmLocation = async () => {
    setIsMapOpen(false)
    try {
      toast.loading('Fetching address...', { id: 'geocode' })
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${tempCoords[1]}&lon=${tempCoords[0]}`)
      const data = await res.json()
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }))
        toast.success('Address updated!', { id: 'geocode' })
      } else {
        toast.dismiss('geocode')
      }
    } catch (err) {
      toast.error('Could not fetch address.', { id: 'geocode' })
    }
  }

  const quickLabels = ['Home', 'Office', 'Gym', 'School', 'Other']

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
          
          {/* Header with gradient accent */}
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? 'Edit Address' : 'New Address'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? 'Update your saved location' : 'Add a new delivery location'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
            
            {/* Quick Label Selector */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                Label
              </label>
              <div className="flex flex-wrap gap-2">
                {quickLabels.map(ql => (
                  <button
                    key={ql}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, label: ql }))}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200",
                      formData.label === ql
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {ql}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full h-12 px-4 rounded-2xl border-2 border-border/40 bg-background/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_4px] focus:shadow-primary/10 transition-all text-[15px] font-medium"
                placeholder="Or type a custom label..."
              />
            </div>

            {/* Full Address */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Full Address
                </label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={handleUseCurrentLocation}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Use My Location
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsMapOpen(!isMapOpen)}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {isMapOpen ? 'Hide Map' : 'Pinpoint on Map'}
                  </button>
                </div>
              </div>

              {isMapOpen && (
                <div className="w-full relative overflow-hidden rounded-2xl border border-border h-[300px]">
                  <div className="absolute top-2 left-2 right-2 z-20 flex gap-2">
                    <input 
                      type="text"
                      placeholder="Search location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleMapSearch())}
                      className="flex-1 px-3 py-1.5 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow focus:ring-2 focus:ring-primary outline-none text-xs"
                    />
                    <button 
                      type="button"
                      onClick={handleMapSearch}
                      className="px-2 py-1.5 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 flex items-center justify-center shrink-0"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Map ref={mapRef} mapStyle={satelliteMapStyle} viewport={{ center: tempCoords, zoom: 16 }} className="w-full h-full">
                    <MapControls position="bottom-right" showZoom showLocate />
                    <MapMarker
                      longitude={tempCoords[0]}
                      latitude={tempCoords[1]}
                      draggable
                      onDragEnd={(e) => setTempCoords([e.lng, e.lat])}
                    >
                      <MarkerContent>
                        <div className="relative flex flex-col items-center cursor-move">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg z-10 relative -top-3">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <div className="w-2 h-1 bg-black/30 rounded-full blur-[1px] absolute bottom-0" />
                        </div>
                      </MarkerContent>
                    </MapMarker>
                  </Map>
                  <div className="absolute bottom-2 left-2 right-12 z-20">
                    <button
                      type="button"
                      onClick={handleConfirmLocation}
                      className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-bold shadow-md hover:bg-primary/90 text-xs"
                    >
                      Confirm Location
                    </button>
                  </div>
                </div>
              )}

              {!isMapOpen && (
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full h-28 p-4 rounded-2xl border-2 border-border/40 bg-background/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_4px] focus:shadow-primary/10 transition-all text-[15px] font-medium resize-none"
                  placeholder="123 Main St, Springfield, IL 62701"
                />
              )}
            </div>

            {/* Default Toggle */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300",
                formData.isDefault 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border/40 bg-muted/30 hover:border-border/60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                  formData.isDefault 
                    ? "bg-primary/15 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  <Star className={cn("w-4 h-4 transition-transform duration-300", formData.isDefault && "scale-110")} />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-[14px] text-foreground block">Default Address</span>
                  <span className="text-[12px] text-muted-foreground">Auto-fill in shipment forms</span>
                </div>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                formData.isDefault 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
                  : "border-2 border-muted-foreground/25"
              )}>
                {formData.isDefault && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </div>
            </button>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={cn(
                    "h-13 rounded-2xl font-bold text-[14px] transition-all duration-200 flex items-center justify-center gap-2",
                    showDeleteConfirm
                      ? "flex-1 bg-red-500 text-white shadow-lg shadow-red-500/25"
                      : "px-5 bg-red-500/10 text-red-500 hover:bg-red-500/15"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                </button>
              )}
              <button
                type="submit"
                className={cn(
                  "flex-1 h-13 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-[15px]",
                  "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                )}
              >
                {isEditing ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
