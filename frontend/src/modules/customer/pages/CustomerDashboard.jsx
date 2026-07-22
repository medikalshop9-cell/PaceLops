import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { PackagePlus, MapPin, CalendarDays, Truck, CheckCircle2, ArrowRight, MoreVertical, AlertCircle, RefreshCw, Box, Activity, CreditCard } from 'lucide-react'
import truckViz from '@/assets/images/Transparent 3D.png'
import { dashboardService } from '../services/dashboard.service'
import { Map, MapMarker, MarkerContent, MapPopup, MapControls } from '@/components/ui/map'
import { mockParcels } from '../data/mockParcels'

const branchCoords = {
  'Accra Central': [-0.2057, 5.556],
  'Kumasi Main Hub': [-1.6244, 6.6885],
  'Tema Port Hub': [-0.0166, 5.6698],
  'Takoradi': [-1.7731, 4.8845],
  'Accra Sorting Facility': [-0.1869, 5.6037]
}

export default function CustomerDashboard() {
  const { setIsMenuOpen } = useOutletContext()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activePopup, setActivePopup] = useState(null)

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true)
    setError(null)
    try {
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(user.id),
        dashboardService.getRecentActivities(user.id)
      ])
      setStats(statsData)
      setActivities(activitiesData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Helper to get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'parcel_update': return <Truck className="w-5 h-5 text-blue-500" />
      case 'payment': return <CreditCard className="w-5 h-5 text-emerald-500" />
      case 'delivery_request': return <PackagePlus className="w-5 h-5 text-primary" />
      default: return <Activity className="w-5 h-5 text-muted-foreground" />
    }
  }

  const activeShipments = mockParcels.filter(p => p.status === 'in_transit' || p.status === 'pending' || p.status === 'ready_for_pickup')

  return (
    <div className="py-8 space-y-10 pb-24">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-card py-4 px-6 md:py-4 md:px-10 border border-border shadow-sm dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-row justify-between gap-4 md:gap-6 h-full items-center">
          {/* Left Stats */}
          <div className="flex flex-col justify-center items-start text-left">
            <p className="text-sm text-muted-foreground">
              Welcome back,
            </p>

            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              {user?.full_name || 'User'}
            </h2>

            <div className="mt-6">
              <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide">
                Total Parcels
              </p>

              {isLoading ? (
                <div className="h-12 w-20 bg-muted animate-pulse rounded-lg mt-2"></div>
              ) : error ? (
                <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mt-2">-</p>
              ) : (
                <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mt-2">
                  {stats?.totalParcels || 0}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                {isLoading ? (
                  <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                ) : (
                  <>
                    <span className="text-foreground">
                      {stats?.inTransit || 0} Parcels In Transit / Ready
                    </span>
                    <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center">
                      <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center 3D Visualization */}
          <div className="relative flex-1 hidden md:flex justify-center items-center -my-2 md:-my-6 pointer-events-none">
            <img
              src={truckViz}
              alt="Logistics Visualization"
              className="h-[140px] md:h-[260px] w-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right Stats */}
          <div className="flex flex-col justify-center items-end text-right">
            <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide mb-1 md:mb-1.5">Delivered Parcels</p>
            {isLoading ? (
              <div className="h-12 w-24 bg-muted animate-pulse rounded-lg mb-1.5"></div>
            ) : error ? (
              <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-1.5 md:mb-2">-</p>
            ) : (
              <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-1.5 md:mb-2">{stats?.delivered || 0}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-foreground tracking-tight">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: PackagePlus, title: 'Ship a Parcel', desc: 'Create a new shipment', primary: true, path: '/customer/new-shipment' },
          { icon: MapPin, title: 'Track Parcel', desc: 'Track your shipments real-time', path: '/customer/track' },
          { icon: CalendarDays, title: 'Book Pickup', desc: 'Schedule a parcel pickup', path: '/customer/pickup-slots' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <div
              key={i}
              onClick={() => navigate(action.path)}
              className={`group relative overflow-hidden rounded-[24px] p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] border ${action.primary
                ? 'bg-primary/5 border-primary/30 hover:shadow-lg shadow-primary/20'
                : 'bg-card border-border hover:border-primary/30 hover:bg-accent shadow-sm hover:shadow-md'
                }`}
            >
              {action.primary && <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 to-primary/5 pointer-events-none" />}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${action.primary ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                  }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">{action.title}</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${action.primary ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40' : 'bg-muted text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80'
                    }`}>
                    {action.primary ? <PackagePlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-1">{action.desc}</p>
              </div>
            </div>
          )
        })}
        </div>
      </div>

      {/* Active Shipments Map */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-foreground tracking-tight">Live Shipments</h3>
        </div>
        <div className="bg-card border border-border rounded-[24px] p-2 h-[400px] overflow-hidden shadow-sm relative">
          <Map viewport={{ center: [-1.0232, 6.5244], zoom: 5.5 }} className="w-full h-full rounded-[20px]">
            <MapControls position="bottom-right" showZoom />
            
            {activeShipments.map(parcel => {
              const coords = branchCoords[parcel.currentBranch] || [-0.2057, 5.556]
              return (
                <MapMarker key={parcel.id} longitude={coords[0]} latitude={coords[1]}>
                  <MarkerContent>
                    <div 
                      className="relative group cursor-pointer flex items-center justify-center"
                      onClick={() => setActivePopup(parcel.id)}
                    >
                      <div className="w-4 h-4 bg-primary rounded-full border-[3px] border-white dark:border-background shadow-[0_0_12px_rgba(0,0,0,0.4)] relative z-10" />
                      <div className="absolute w-8 h-8 bg-primary/30 rounded-full animate-ping" />
                    </div>
                  </MarkerContent>
                  {activePopup === parcel.id && (
                    <MapPopup 
                      longitude={coords[0]} 
                      latitude={coords[1]} 
                      closeButton 
                      onClose={() => setActivePopup(null)}
                      offset={14}
                    >
                      <div className="p-1 min-w-[120px]">
                        <p className="text-xs font-bold text-foreground">{parcel.trackingNumber}</p>
                        <p className="text-[10px] text-muted-foreground mb-1">{parcel.currentBranch}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-primary uppercase">{parcel.status.replace(/_/g, ' ')}</span>
                          {parcel.estimatedDelivery && (
                            <span className="text-[9px] text-muted-foreground">ETA: {new Date(parcel.estimatedDelivery).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </MapPopup>
                  )}
                </MapMarker>
              )
            })}
          </Map>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-foreground tracking-tight">Recent Activity</h3>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loader for Activities
            [1, 2, 3].map(i => (
              <div key={i} className="bg-card border border-border rounded-[24px] p-6 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-muted shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            ))
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-border border-dashed rounded-[24px] bg-card/50">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">Failed to load activities</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button onClick={fetchDashboardData} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : activities.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-border border-dashed rounded-[24px] bg-card/50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">No recent activity</h3>
              <p className="text-sm text-muted-foreground max-w-sm">You havent made any shipments or payments yet. Create a new shipment to get started.</p>
              <button onClick={() => navigate('/customer/new-shipment')} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <PackagePlus className="w-4 h-4" /> Ship a Parcel
              </button>
            </div>
          ) : (
            // Activity Feed
            <div className="relative border-l-2 border-muted ml-6 space-y-8 py-4">
              {activities.map((activity, idx) => (
                <div key={activity.id || idx} className="relative pl-8">
                  {/* Timeline dot/icon */}
                  <div className="absolute -left-[25px] bg-card border-2 border-muted p-1.5 rounded-full flex items-center justify-center top-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-foreground text-base tracking-tight mb-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted px-2.5 py-1 rounded-md">
                        {activity.timeAgo || 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
