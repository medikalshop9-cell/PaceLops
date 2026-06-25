import { useOutletContext } from 'react-router-dom'
import { PackagePlus, Calculator, Map, Headset, Truck, CheckCircle2, ArrowRight, TrendingUp, MoreVertical } from 'lucide-react'
import truckViz from '@/assets/images/3D visualisation.png'

export default function CustomerDashboard() {
  const { setIsMenuOpen } = useOutletContext()

  return (
    <div className="py-8 space-y-10 pb-24">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#12182B] to-[#0A0E1A] py-4 px-6 md:py-4 md:px-10 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF7A00]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 h-full items-center">
          {/* Left Stats */}
          <div className="flex flex-col justify-center">
            <p className="text-slate-400 text-sm font-medium tracking-wide mb-1.5">Active shipments</p>
            <p className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-2">3</p>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <span className="text-white">In transit</span>
              <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center opacity-70">
                <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
              </div>
            </div>
          </div>

          {/* Center 3D Visualization */}
          <div className="relative flex-1 flex justify-center items-center py-2 md:-my-6 pointer-events-none">
            <img
              src={truckViz}
              alt="Logistics Visualization"
              className="h-[200px] md:h-[260px] w-auto object-contain drop-shadow-2xl mix-blend-screen"
            />
          </div>

          {/* Right Stats */}
          <div className="flex flex-col justify-center items-start md:items-end text-left md:text-right">
            <p className="text-slate-400 text-sm font-medium tracking-wide mb-1.5">Delivered this month</p>
            <p className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-2">27</p>
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
                ? 'bg-gradient-to-br from-[#FF7A00]/10 to-transparent border-[#FF7A00]/30 hover:shadow-[0_0_30px_-5px_rgba(255,122,0,0.3)]'
                : 'bg-[#12182B]/50 border-white/5 hover:border-white/10 hover:bg-[#12182B] hover:shadow-xl'
                }`}
            >
              {action.primary && <div className="absolute inset-0 bg-gradient-to-tr from-[#FF7A00]/0 to-[#FF7A00]/5 pointer-events-none" />}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${action.primary ? 'bg-[#FF7A00]/20 text-[#FF7A00]' : 'bg-white/5 text-slate-300 group-hover:bg-white/10'
                  }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">{action.title}</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${action.primary ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/40' : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                    }`}>
                    {action.primary ? <PackagePlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-1">{action.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Shipments */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-white tracking-tight">Recent shipments</h3>
          <button className="text-[#FF7A00] text-sm font-semibold hover:text-[#E05E00] transition-colors flex items-center gap-1">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {/* Active Shipment Card */}
          <div className="group bg-[#12182B]/60 backdrop-blur-sm rounded-[24px] p-6 border border-white/5 hover:border-white/10 transition-all hover:shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between gap-6 items-center">

              <div className="flex items-center gap-5 w-full md:w-1/4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Truck className="w-6 h-6 text-[#FF7A00]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white mb-0.5 tracking-tight">PCL-4821</h4>
                  <p className="text-xs font-medium text-slate-400">Asafo → Accra-Circle</p>
                </div>
              </div>

              {/* Progress Line */}
              <div className="flex-1 w-full px-2 md:px-8 relative">
                <div className="flex justify-end items-center mb-3 pr-2">
                  <span className="px-3 py-1 bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-medium rounded-full border border-[#FF7A00]/20">In transit</span>
                </div>
                <div className="relative">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span>Asafo</span>
                    <span>Accra-Circle</span>
                  </div>
                  <div className="relative h-1 bg-slate-800 rounded-full flex items-center">
                    <div className="absolute left-0 h-full bg-[#FF7A00] rounded-full" style={{ width: '60%' }}></div>
                    <div className="absolute left-0 w-2 h-2 bg-[#FF7A00] rounded-full -ml-1"></div>

                    <div className="absolute w-5 h-5 bg-[#0B1020] text-[#FF7A00] flex items-center justify-center rounded-full -mt-0.5 z-10 shadow-lg shadow-[#FF7A00]/20 border border-[#FF7A00]/30" style={{ left: '60%', transform: 'translateX(-50%)' }}>
                      <Truck className="w-3 h-3 fill-current" />
                    </div>

                    <div className="absolute right-0 w-2 h-2 bg-slate-600 rounded-full -mr-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-1/4 text-right">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">ETA</p>
                  <p className="text-sm text-slate-300">Tomorrow, 10:30 AM</p>
                </div>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Delivered Shipment Card */}
          <div className="group bg-[#12182B]/30 rounded-[24px] p-6 border border-white/5 hover:border-white/10 transition-all hover:shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between gap-6 items-center">

              <div className="flex items-center gap-5 w-full md:w-1/4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white mb-0.5 tracking-tight">PCL-4790</h4>
                  <p className="text-xs font-medium text-slate-400">Lagos → Ibadan</p>
                </div>
              </div>

              <div className="flex-1 w-full flex justify-end md:justify-center">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full border border-emerald-500/20">Delivered</span>
              </div>

              <div className="flex items-center justify-between w-full md:w-1/4 text-right">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">Delivered on</p>
                  <p className="text-sm text-slate-300">May 24, 2024, 2:45 PM</p>
                </div>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
