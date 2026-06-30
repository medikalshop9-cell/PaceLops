import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Search, MapPin, Calendar, Clock, CreditCard, User, Box, Truck, CheckCircle2, AlertCircle, X, ChevronRight } from 'lucide-react'
import { 
  Sheet, 
  SheetContent, 
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Mock Data
const mockParcels = [
  {
    id: 'PCL-1001',
    trackingNumber: 'TRK987654321',
    status: 'in_transit',
    sender: { name: 'Alice Smith', address: '123 Main St, Accra Central', phone: '+233 24 123 4567', email: 'alice@example.com' },
    receiver: { name: 'Bob Jones', address: '456 Market St, Kumasi', phone: '+233 20 987 6543', email: 'bob@example.com' },
    currentBranch: 'Kumasi Main Hub',
    createdAt: '2026-06-25T10:30:00Z',
    parcelInfo: { type: 'Box / Package', weight: '2.5 kg', estimatedValue: '$150.00', instructions: 'Fragile, handle with care' },
    paymentStatus: 'Paid',
    pickupAppointment: '2026-06-25T14:00:00Z',
    deliveryMethod: 'Home Delivery',
    deliverySpeed: 'Standard',
    timeline: [
      { status: 'pending', location: 'Accra Central', time: '2026-06-25T10:30:00Z', description: 'Shipment created' },
      { status: 'picked_up', location: 'Accra Central', time: '2026-06-25T14:15:00Z', description: 'Parcel picked up by courier' },
      { status: 'in_transit', location: 'Kumasi Main Hub', time: '2026-06-26T08:45:00Z', description: 'Arrived at destination hub' }
    ]
  },
  {
    id: 'PCL-1002',
    trackingNumber: 'TRK456789123',
    status: 'pending',
    sender: { name: 'Alice Smith', address: '123 Main St, Accra Central', phone: '+233 24 123 4567', email: 'alice@example.com' },
    receiver: { name: 'Charlie Brown', address: '789 Beach Rd, Takoradi', phone: '+233 55 111 2222', email: 'charlie@example.com' },
    currentBranch: 'Accra Central',
    createdAt: '2026-06-29T16:45:00Z',
    parcelInfo: { type: 'Document', weight: '0.2 kg', estimatedValue: '$50.00', instructions: 'Do not fold' },
    paymentStatus: 'Paid',
    pickupAppointment: '2026-06-30T09:00:00Z',
    deliveryMethod: 'Branch Pickup',
    deliverySpeed: 'Express',
    timeline: [
      { status: 'pending', location: 'Accra Central', time: '2026-06-29T16:45:00Z', description: 'Shipment created, awaiting pickup' }
    ]
  },
  {
    id: 'PCL-1003',
    trackingNumber: 'TRK112233445',
    status: 'delivered',
    sender: { name: 'Alice Smith', address: '123 Main St, Accra Central', phone: '+233 24 123 4567', email: 'alice@example.com' },
    receiver: { name: 'Diana Prince', address: '321 Amazon Way, Tema', phone: '+233 27 999 8888', email: 'diana@example.com' },
    currentBranch: 'Tema Port Hub',
    createdAt: '2026-06-20T08:15:00Z',
    parcelInfo: { type: 'Electronics', weight: '1.8 kg', estimatedValue: '$450.00', instructions: 'Keep dry' },
    paymentStatus: 'Paid',
    pickupAppointment: '2026-06-20T10:00:00Z',
    deliveryMethod: 'Home Delivery',
    deliverySpeed: 'Express',
    timeline: [
      { status: 'pending', location: 'Accra Central', time: '2026-06-20T08:15:00Z', description: 'Shipment created' },
      { status: 'picked_up', location: 'Accra Central', time: '2026-06-20T10:30:00Z', description: 'Parcel picked up by courier' },
      { status: 'in_transit', location: 'Tema Port Hub', time: '2026-06-20T14:45:00Z', description: 'Arrived at destination hub' },
      { status: 'out_for_delivery', location: 'Tema Port Hub', time: '2026-06-21T08:00:00Z', description: 'Out for delivery' },
      { status: 'delivered', location: '321 Amazon Way, Tema', time: '2026-06-21T11:20:00Z', description: 'Delivered to receiver' }
    ]
  },
  {
    id: 'PCL-1004',
    trackingNumber: 'TRK998877665',
    status: 'ready_for_pickup',
    sender: { name: 'Alice Smith', address: '123 Main St, Accra Central', phone: '+233 24 123 4567', email: 'alice@example.com' },
    receiver: { name: 'Evan Davis', address: 'Pick up at Branch', phone: '+233 24 555 4444', email: 'evan@example.com' },
    currentBranch: 'Kumasi Main Hub',
    createdAt: '2026-06-27T11:00:00Z',
    parcelInfo: { type: 'Box / Package', weight: '5.0 kg', estimatedValue: '$200.00', instructions: '' },
    paymentStatus: 'Paid',
    pickupAppointment: '2026-06-27T13:00:00Z',
    deliveryMethod: 'Branch Pickup',
    deliverySpeed: 'Standard',
    timeline: [
      { status: 'pending', location: 'Accra Central', time: '2026-06-27T11:00:00Z', description: 'Shipment created' },
      { status: 'picked_up', location: 'Accra Central', time: '2026-06-27T13:30:00Z', description: 'Parcel picked up by courier' },
      { status: 'in_transit', location: 'Kumasi Main Hub', time: '2026-06-28T09:15:00Z', description: 'Arrived at destination hub' },
      { status: 'ready_for_pickup', location: 'Kumasi Main Hub', time: '2026-06-28T10:00:00Z', description: 'Ready for receiver to pick up at branch' }
    ]
  },
  {
    id: 'PCL-1005',
    trackingNumber: 'TRK334455667',
    status: 'returned',
    sender: { name: 'Alice Smith', address: '123 Main St, Accra Central', phone: '+233 24 123 4567', email: 'alice@example.com' },
    receiver: { name: 'Frank Castle', address: 'Unknown Address, Kasoa', phone: '+233 20 000 0000', email: 'frank@example.com' },
    currentBranch: 'Accra Central',
    createdAt: '2026-06-15T09:30:00Z',
    parcelInfo: { type: 'Document', weight: '0.1 kg', estimatedValue: '$20.00', instructions: '' },
    paymentStatus: 'Paid',
    pickupAppointment: '2026-06-15T11:00:00Z',
    deliveryMethod: 'Home Delivery',
    deliverySpeed: 'Standard',
    timeline: [
      { status: 'pending', location: 'Accra Central', time: '2026-06-15T09:30:00Z', description: 'Shipment created' },
      { status: 'picked_up', location: 'Accra Central', time: '2026-06-15T11:45:00Z', description: 'Parcel picked up by courier' },
      { status: 'in_transit', location: 'Kasoa Hub', time: '2026-06-16T08:20:00Z', description: 'Arrived at destination hub' },
      { status: 'out_for_delivery', location: 'Kasoa Hub', time: '2026-06-16T09:00:00Z', description: 'Out for delivery' },
      { status: 'delivery_failed', location: 'Kasoa', time: '2026-06-16T14:00:00Z', description: 'Delivery failed: Address not found' },
      { status: 'returned', location: 'Accra Central', time: '2026-06-18T10:00:00Z', description: 'Returned to sender branch' }
    ]
  }
]

const statusConfig = {
  pending: { label: 'Pending', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 ring-amber-500/30', accentClass: 'bg-amber-500' },
  in_transit: { label: 'In Transit', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500 ring-blue-500/30', accentClass: 'bg-blue-500' },
  ready_for_pickup: { label: 'Ready for Pickup', badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500 ring-purple-500/30', accentClass: 'bg-purple-500' },
  delivered: { label: 'Delivered', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500 ring-emerald-500/30', accentClass: 'bg-emerald-500' },
  returned: { label: 'Returned', badgeClass: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500 ring-red-500/30', accentClass: 'bg-red-500' },
}

const tabs = [
  { id: 'all', label: 'All Parcels' },
  { id: 'pending', label: 'Pending' },
  { id: 'in_transit', label: 'In Transit' },
  { id: 'ready_for_pickup', label: 'Ready for Pickup' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'returned', label: 'Returned' },
]

export default function MyParcelsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Filter parcels based on tab and search
  const filteredParcels = mockParcels.filter(parcel => {
    const matchesTab = activeTab === 'all' || parcel.status === activeTab
    const matchesSearch = parcel.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          parcel.receiver.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const openParcelDetails = (parcel) => {
    setSelectedParcel(parcel)
    setIsSheetOpen(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">My Parcels</h1>
            <p className="text-sm text-muted-foreground font-medium">Manage and track your active shipments.</p>
          </div>
          
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search tracking or receiver..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-card border border-border shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all dark:bg-card/40 dark:backdrop-blur-xl"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs Filter (Mobile Optimized) */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-3 pb-4 pt-1 snap-x snap-mandatory">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 snap-center border shrink-0",
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-muted/50 dark:bg-card/40 dark:backdrop-blur-md"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parcels Grid */}
        {filteredParcels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParcels.map((parcel) => (
              <div 
                key={parcel.id} 
                className="relative bg-card dark:bg-card/40 dark:backdrop-blur-xl border border-border shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 group overflow-hidden flex flex-col h-full"
              >
                {/* Status Accent Line */}
                <div className={cn("absolute top-0 left-0 w-full h-1.5 transition-all duration-500 opacity-80 group-hover:opacity-100", statusConfig[parcel.status].accentClass)} />
                
                {/* Inner Glow (Dark Mode Only) */}
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-start mb-6 mt-1">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Tracking Number</p>
                    <p className="font-mono font-bold text-foreground text-xl tracking-tight">{parcel.trackingNumber}</p>
                  </div>
                  <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold ring-1 uppercase tracking-wider backdrop-blur-md", statusConfig[parcel.status].badgeClass)}>
                    {statusConfig[parcel.status].label}
                  </span>
                </div>

                <div className="relative z-10 space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/50 border border-border/50 transition-colors group-hover:bg-muted/80 dark:bg-muted/30 dark:group-hover:bg-muted/50">
                    <div className="p-2 bg-background rounded-xl shadow-sm border border-border shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Receiver</p>
                      <p className="text-sm font-semibold text-foreground">{parcel.receiver.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/50 border border-border/50 transition-colors group-hover:bg-muted/80 dark:bg-muted/30 dark:group-hover:bg-muted/50">
                    <div className="p-2 bg-background rounded-xl shadow-sm border border-border shrink-0">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Current Location</p>
                      <p className="text-sm font-semibold text-foreground">{parcel.currentBranch}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-2xl bg-muted/50 border border-border/50 transition-colors group-hover:bg-muted/80 dark:bg-muted/30 dark:group-hover:bg-muted/50">
                    <div className="p-2 bg-background rounded-xl shadow-sm border border-border shrink-0">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-0.5">Date Created</p>
                      <p className="text-sm font-semibold text-foreground">{formatDate(parcel.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => openParcelDetails(parcel)}
                  className="relative z-10 w-full py-3.5 bg-background dark:bg-background/60 dark:backdrop-blur-md text-foreground rounded-2xl font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border group-hover:border-primary/30 flex items-center justify-center gap-2 shadow-sm"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-card dark:bg-card/40 dark:backdrop-blur-xl border border-border border-dashed rounded-[3rem] shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-border/50">
              <Package className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No parcels found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">We couldn't find any parcels matching your current filters or search query.</p>
          </div>
        )}

        {/* Parcel Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-md md:max-w-xl p-0 flex flex-col bg-card dark:bg-card/95 dark:backdrop-blur-3xl border-l border-border z-[100] shadow-2xl">
            {selectedParcel && (
              <>
                {/* Sheet Header */}
                <div className="p-8 border-b border-border bg-muted/30 dark:bg-gradient-to-b dark:from-muted/50 dark:to-transparent relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold ring-1 uppercase tracking-wider backdrop-blur-md", statusConfig[selectedParcel.status].badgeClass)}>
                      {statusConfig[selectedParcel.status].label}
                    </span>
                    <button onClick={() => setIsSheetOpen(false)} className="p-2 hover:bg-background rounded-full transition-all border border-transparent hover:border-border shadow-sm">
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground mb-2 font-mono tracking-tight relative z-10">{selectedParcel.trackingNumber}</h2>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 relative z-10">
                    <Calendar className="w-4 h-4" />
                    Created {formatDate(selectedParcel.createdAt)} at {formatTime(selectedParcel.createdAt)}
                  </p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar relative">
                  
                  {/* Status Timeline */}
                  <section>
                    <h3 className="text-xs font-extrabold text-muted-foreground mb-6 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      Status Timeline
                    </h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-border">
                      {selectedParcel.timeline.map((event, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full border-2 bg-background z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-500",
                            index === selectedParcel.timeline.length - 1 ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(var(--color-primary),0.5)] scale-125" : "border-border"
                          )}>
                            {index === selectedParcel.timeline.length - 1 && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                          </div>
                          <div className={cn(
                            "w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl bg-card border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-card/50 dark:backdrop-blur-sm",
                            index === selectedParcel.timeline.length - 1 ? "border-primary/40 shadow-md" : "border-border shadow-sm"
                          )}>
                            <div className="flex justify-between items-start mb-2">
                              <span className={cn("font-extrabold text-sm capitalize", index === selectedParcel.timeline.length - 1 ? "text-primary" : "text-foreground")}>
                                {event.status.replace('_', ' ')}
                              </span>
                              <span className="text-xs font-bold text-muted-foreground">{formatDate(event.time)}</span>
                            </div>
                            <p className="text-sm font-medium text-foreground leading-relaxed mb-3">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </p>
                              <p className="text-xs font-semibold text-muted-foreground">{formatTime(event.time)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sender */}
                    <section className="bg-card dark:bg-card/40 dark:backdrop-blur-md p-6 rounded-3xl border border-border shadow-sm">
                      <h3 className="text-xs font-extrabold text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                        <div className="p-1.5 bg-muted rounded-md"><User className="w-3.5 h-3.5" /></div>
                        Sender
                      </h3>
                      <div className="space-y-3">
                        <p className="font-bold text-base text-foreground">{selectedParcel.sender.name}</p>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{selectedParcel.sender.address}</p>
                        <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">{selectedParcel.sender.phone}</p>
                          <p className="text-xs font-semibold text-muted-foreground">{selectedParcel.sender.email}</p>
                        </div>
                      </div>
                    </section>

                    {/* Receiver */}
                    <section className="bg-card dark:bg-card/40 dark:backdrop-blur-md p-6 rounded-3xl border border-border shadow-sm">
                      <h3 className="text-xs font-extrabold text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                        <div className="p-1.5 bg-muted rounded-md"><User className="w-3.5 h-3.5" /></div>
                        Receiver
                      </h3>
                      <div className="space-y-3">
                        <p className="font-bold text-base text-foreground">{selectedParcel.receiver.name}</p>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{selectedParcel.receiver.address}</p>
                        <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground">{selectedParcel.receiver.phone}</p>
                          <p className="text-xs font-semibold text-muted-foreground">{selectedParcel.receiver.email}</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Parcel Information */}
                  <section>
                    <h3 className="text-xs font-extrabold text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-md"><Box className="w-4 h-4 text-primary" /></div>
                      Parcel Details
                    </h3>
                    <div className="bg-card dark:bg-card/40 dark:backdrop-blur-md border border-border rounded-3xl p-6 shadow-sm grid grid-cols-2 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Type</p>
                        <p className="text-sm font-semibold text-foreground">{selectedParcel.parcelInfo.type}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Weight</p>
                        <p className="text-sm font-semibold text-foreground">{selectedParcel.parcelInfo.weight}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Est. Value</p>
                        <p className="text-sm font-semibold text-foreground">{selectedParcel.parcelInfo.estimatedValue}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Payment</p>
                        <p className="text-sm font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {selectedParcel.paymentStatus}
                        </p>
                      </div>
                      {selectedParcel.parcelInfo.instructions && (
                        <div className="col-span-2 pt-4 border-t border-border">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Instructions</p>
                          <p className="text-sm font-medium text-foreground leading-relaxed">{selectedParcel.parcelInfo.instructions}</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Logistics */}
                  <section className="pb-8">
                    <h3 className="text-xs font-extrabold text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-3">
                      <div className="p-1.5 bg-primary/10 rounded-md"><Truck className="w-4 h-4 text-primary" /></div>
                      Logistics
                    </h3>
                    <div className="bg-card dark:bg-card/40 dark:backdrop-blur-md border border-border rounded-3xl p-6 shadow-sm grid grid-cols-2 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Method</p>
                        <p className="text-sm font-semibold text-foreground">{selectedParcel.deliveryMethod}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Speed</p>
                        <p className="text-sm font-semibold text-foreground">{selectedParcel.deliverySpeed}</p>
                      </div>
                      <div className="col-span-2 pt-4 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">Pickup Appt.</p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDate(selectedParcel.pickupAppointment)}
                          </p>
                        </div>
                        <p className="text-sm font-bold bg-muted/50 px-3 py-1.5 rounded-lg border border-border text-foreground">
                          {formatTime(selectedParcel.pickupAppointment)}
                        </p>
                      </div>
                    </div>
                  </section>

                </div>
                
                {/* Sheet Footer Actions */}
                <div className="p-6 border-t border-border bg-card dark:bg-background/50 dark:backdrop-blur-xl relative z-20">
                  <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(var(--color-primary),0.3)] shadow-md flex justify-center items-center gap-2">
                    Download Receipt
                  </button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
