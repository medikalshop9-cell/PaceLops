import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PackagePlus, Calculator, Map, Headset, Truck, CheckCircle2, ArrowRight, TrendingUp, MoreVertical } from 'lucide-react'
import truckViz from '@/assets/images/Transparent 3D.png'
import { useAuthStore } from '@/store/useAuthStore'

const initialShipments = [
  {
    id: 'PCL-4821',
    origin: 'Asafo',
    destination: 'Accra-Circle',
    status: 'in_transit',
    eta: 'Tomorrow, 10:30 AM',
    totalDistance: 100,
    coveredDistance: 10,
  },
  {
    id: 'PCL-4790',
    origin: 'Lagos',
    destination: 'Ibadan',
    status: 'delivered',
    deliveredOn: 'May 24, 2024, 2:45 PM',
    totalDistance: 100,
    coveredDistance: 100,
  }
]

export default function CustomerDashboard() {
  const { setIsMenuOpen } = useOutletContext()
  const { user } = useAuthStore()

  // Real-time tracking simulation
  const [shipments, setShipments] = useState(initialShipments)

  useEffect(() => {
    const interval = setInterval(() => {
      setShipments(prev => prev.map(shipment => {
        if (shipment.status === 'in_transit' && shipment.coveredDistance < shipment.totalDistance) {
          return {
            ...shipment,
            coveredDistance: Math.min(shipment.coveredDistance + 2, shipment.totalDistance)
          }
        }
        return shipment
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

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
            <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide mb-1 md:mb-1.5">Active shipments</p>
            <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-1.5 md:mb-2">3</p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-foreground">In transit</span>
              <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center opacity-70">
                <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
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
            <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide mb-1 md:mb-1.5">Delivered this month</p>
            <p className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-1.5 md:mb-2">27</p>
            <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
              <span className="text-emerald-400">+18%</span> vs last month
              <ArrowRight className="w-3.5 h-3.5 -rotate-45" />
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: PackagePlus, title: 'New Shipment', desc: 'Create a new shipment', primary: true },
          { icon: Calculator, title: 'Get Estimate', desc: 'Calculate shipping cost' },
          { icon: Map, title: 'Find Branch', desc: 'Locate nearest branch' },
          { icon: Headset, title: 'Support', desc: 'Get help & support' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <div
              key={i}
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

      {/* Recent Shipments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-foreground tracking-tight">Recent shipments</h3>
          <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors flex items-center gap-1">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {shipments.map(shipment => {
            const isDelivered = shipment.status === 'delivered';
            const progress = (shipment.coveredDistance / shipment.totalDistance) * 100;

            return (
              <div 
                key={shipment.id} 
                className={`group backdrop-blur-sm rounded-[24px] p-6 border border-border transition-all relative overflow-hidden ${
                  isDelivered 
                    ? 'bg-muted/30 hover:border-primary/30 shadow-sm hover:shadow-md' 
                    : 'bg-card hover:border-primary/30 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 items-center">

                  <div className="flex items-center gap-5 w-full md:w-1/4">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 border border-border">
                      {isDelivered ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Truck className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-0.5 tracking-tight">{shipment.id}</h4>
                      <p className="text-xs font-medium text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="flex-1 px-2 md:px-8 relative">
                    <div className="flex justify-end items-center mb-3 pr-2">
                      {isDelivered ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full border border-emerald-500/20">Delivered</span>
                      ) : (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">In transit</span>
                      )}
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                        <span>{shipment.origin}</span>
                        <span>{shipment.destination}</span>
                      </div>
                      <div className="relative h-1 bg-muted rounded-full flex items-center">
                        <div className="absolute left-0 h-full bg-primary rounded-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
                        <div className="absolute left-0 w-2 h-2 bg-primary rounded-full -ml-1"></div>

                        <div 
                          className="absolute w-5 h-5 bg-card text-primary flex items-center justify-center rounded-full -mt-0.5 z-10 shadow-lg shadow-primary/20 border border-primary/30 transition-all duration-1000 ease-linear" 
                          style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                        >
                          {isDelivered ? <CheckCircle2 className="w-3 h-3 fill-current text-emerald-500" /> : <Truck className="w-3 h-3 fill-current" />}
                        </div>

                        <div className="absolute right-0 w-2 h-2 bg-border rounded-full -mr-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-1/4 text-right">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        {isDelivered ? 'Delivered on' : 'ETA'}
                      </p>
                      <p className="text-sm text-foreground">
                        {isDelivered ? shipment.deliveredOn : shipment.eta}
                      </p>
                    </div>
                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
