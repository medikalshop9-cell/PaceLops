import React, { useState } from 'react'
import { Package, Truck, MapPin, Search, Clock, Box, ShieldCheck, XCircle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDeliveryStore } from '../store/useDeliveryStore'
import { RequestDeliveryModal } from '../components/RequestDeliveryModal'

export default function DeliveryRequestsPage() {
  const { readyParcels, activeRequests, cancelDeliveryRequest } = useDeliveryStore()
  const [activeTab, setActiveTab] = useState('ready') // 'ready' or 'active'
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal State
  const [requestModalData, setRequestModalData] = useState(null)

  const filteredReady = readyParcels.filter(p => 
    p.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredActive = activeRequests.filter(r => 
    r.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="py-8 pb-20 space-y-8 animate-scale-up">
      
      {/* Header Section */}
      <section className="space-y-2 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 text-primary">
          <Truck className="w-6 h-6" />
          <h1 className="text-xs font-bold tracking-widest uppercase">Delivery</h1>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Home Delivery
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base leading-relaxed">
          Request home delivery for parcels that have arrived at your local hub.
        </p>
      </section>

      {/* Tabs & Search */}
      <section className="px-4 sm:px-6 lg:px-10 space-y-6">
        
        {/* Search Bar */}
        <div className="relative group max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by tracking number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-card border border-border rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all premium-shadow"
          />
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-muted/50 rounded-2xl max-w-sm">
          <button
            onClick={() => setActiveTab('ready')}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300",
              activeTab === 'ready' 
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Ready for Delivery
            <span className={cn(
              "ml-2 px-1.5 py-0.5 rounded-md text-[10px]",
              activeTab === 'ready' ? "bg-primary/10 text-primary" : "bg-border/50"
            )}>
              {readyParcels.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300",
              activeTab === 'active' 
                ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Active Requests
            <span className={cn(
              "ml-2 px-1.5 py-0.5 rounded-md text-[10px]",
              activeTab === 'active' ? "bg-primary/10 text-primary" : "bg-border/50"
            )}>
              {activeRequests.length}
            </span>
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 lg:px-10">
        
        {/* READY PARCELS TAB */}
        {activeTab === 'ready' && (
          <div className="space-y-4">
            {filteredReady.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-3xl bg-card/30">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No parcels ready</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                  You don't have any parcels currently waiting at the hub for delivery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredReady.map(parcel => (
                  <div key={parcel.id} className="bg-card rounded-3xl border border-border/50 p-5 premium-shadow hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
                          <ShieldCheck className="w-3 h-3" />
                          Ready
                        </span>
                        <h4 className="font-bold text-foreground truncate">{parcel.trackingNumber}</h4>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Box className="w-4 h-4 shrink-0" />
                        <span className="truncate">{parcel.description} • {parcel.weight}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">At: {parcel.origin}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Arrived {formatDistanceToNow(new Date(parcel.arrivedAt))} ago</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setRequestModalData(parcel)}
                      className="w-full rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold h-11 transition-all"
                    >
                      Request Delivery
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACTIVE REQUESTS TAB */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {filteredActive.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border rounded-3xl bg-card/30">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No active requests</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                  You haven't requested any deliveries yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredActive.map(request => (
                  <div key={request.id} className="bg-card rounded-3xl border border-border/50 p-5 premium-shadow flex flex-col h-full relative overflow-hidden">
                    
                    {/* Background decoration */}
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-wider uppercase">
                          <Truck className="w-3 h-3" />
                          {request.status}
                        </span>
                        <h4 className="font-bold text-foreground truncate">{request.trackingNumber}</h4>
                        <p className="text-xs text-muted-foreground">Req ID: {request.id}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6 flex-1 relative z-10">
                      <div className="flex items-start gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                        <div className="space-y-1">
                          <span className="block font-medium text-foreground text-xs uppercase tracking-wider">Destination</span>
                          <span className="block leading-relaxed line-clamp-2">{request.address}</span>
                        </div>
                      </div>
                      
                      {request.instructions && (
                        <div className="flex items-start gap-3 text-sm text-muted-foreground pt-2 border-t border-border/50">
                          <span className="w-4 h-4 flex items-center justify-center shrink-0">📝</span>
                          <span className="italic">"{request.instructions}"</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between relative z-10">
                      <span className="text-xs text-muted-foreground">
                        Requested {format(new Date(request.requestedAt), 'MMM d, h:mm a')}
                      </span>
                      <button 
                        onClick={() => cancelDeliveryRequest(request.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Request Modal */}
      <RequestDeliveryModal 
        parcel={requestModalData}
        isOpen={!!requestModalData}
        onClose={() => setRequestModalData(null)}
        onSuccess={() => {
          setRequestModalData(null)
          setActiveTab('active')
        }}
      />
    </div>
  )
}
