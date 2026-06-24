import { useOutletContext } from 'react-router-dom'
import { Menu, PackagePlus, Calculator, Map, Headset, Truck, CheckCircle2 } from 'lucide-react'

export default function CustomerDashboard() {
  const { setIsMenuOpen } = useOutletContext()

  return (
    <div className="py-6 space-y-8 pb-24">
      {/* Header Area */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 bg-slate-800 text-white rounded-xl shadow-sm hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-slate-900 to-slate-800 p-6 md:p-8 shadow-xl text-white">
        {/* Concentric rings texture */}
        <div className="absolute -top-16 -right-16 w-48 h-48 border-[1px] border-[#fe6b00]/20 rounded-full opacity-60"></div>
        <div className="absolute -top-8 -right-8 w-32 h-32 border-[1px] border-[#fe6b00]/30 rounded-full opacity-60"></div>
        <div className="absolute top-4 right-4 w-12 h-12 bg-[#fe6b00] rounded-full flex items-center justify-center font-semibold text-slate-900 text-lg shadow-sm">
          S
        </div>

        <div className="text-center md:text-left mb-8 mt-2">
          <p className="text-slate-400 text-sm mb-1">Welcome back</p>
          <h2 className="text-3xl font-bold tracking-tight">Hi, Sarah</h2>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-sm mb-1">Active shipments</p>
            <p className="text-4xl font-bold">3</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-1">Delivered this month</p>
            <p className="text-4xl font-bold">27</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-[#fe6b00]/10 text-[#fe6b00] flex items-center justify-center hover:bg-[#fe6b00]/20 transition-colors shadow-sm">
            <PackagePlus className="w-6 h-6" />
          </button>
          <span className="text-xs font-medium text-slate-600 text-center">New<br/>Shipment</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-slate-800/5 text-slate-600 flex items-center justify-center hover:bg-slate-800/10 transition-colors shadow-sm">
            <Calculator className="w-6 h-6" />
          </button>
          <span className="text-xs font-medium text-slate-600 text-center">Get<br/>Estimate</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-slate-800/5 text-slate-600 flex items-center justify-center hover:bg-slate-800/10 transition-colors shadow-sm">
            <Map className="w-6 h-6" />
          </button>
          <span className="text-xs font-medium text-slate-600 text-center">Find<br/>Branch</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-full bg-slate-800/5 text-slate-600 flex items-center justify-center hover:bg-slate-800/10 transition-colors shadow-sm">
            <Headset className="w-6 h-6" />
          </button>
          <span className="text-xs font-medium text-slate-600 text-center">Support</span>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent shipments</h3>
          <button className="text-[#fe6b00] text-sm font-medium hover:underline">See all</button>
        </div>

        {/* Active Shipment Card */}
        <div className="bg-slate-800 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.03)] text-white">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg">PCL-4821</h4>
            <span className="px-3 py-1 bg-[#fe6b00]/20 text-[#fe6b00] text-xs font-semibold rounded-full">In transit</span>
          </div>
          
          {/* Progress Bar / Route Line */}
          <div className="relative mb-6">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span>Lagos</span>
              <span>Abuja</span>
            </div>
            
            <div className="relative h-1 bg-slate-600 rounded-full flex items-center">
              {/* Progress fill */}
              <div className="absolute left-0 h-full bg-[#fe6b00] rounded-full" style={{ width: '60%' }}></div>
              
              {/* Origin Dot */}
              <div className="absolute left-0 w-2 h-2 bg-[#fe6b00] rounded-full -ml-1"></div>
              
              {/* Truck Icon */}
              <div className="absolute w-5 h-5 bg-slate-800 text-[#fe6b00] flex items-center justify-center -mt-0.5" style={{ left: '60%', transform: 'translateX(-50%)' }}>
                <Truck className="w-4 h-4 fill-current" />
              </div>

              {/* Destination Dot */}
              <div className="absolute right-0 w-2 h-2 bg-slate-400 rounded-full -mr-1"></div>
            </div>
          </div>
        </div>

        {/* Delivered Shipment Card */}
        <div className="bg-slate-800 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.03)] text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-base">PCL-4790</h4>
              <p className="text-xs text-slate-400">Lagos → Ibadan</p>
            </div>
          </div>
          <span className="text-emerald-500 text-sm font-semibold">Delivered</span>
        </div>
      </div>
    </div>
  )
}
