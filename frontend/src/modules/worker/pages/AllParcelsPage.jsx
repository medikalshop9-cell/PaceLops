import { useState } from 'react'
import { Search, Filter, Phone, Truck, User, MapPin, CheckCircle2, Copy, X, SlidersHorizontal, Layers } from 'lucide-react'
import { useWorkerStore } from '../store/useWorkerStore'
import { useThemeStore } from '../store/useThemeStore'
import { ParcelMap } from '../components/ParcelMap'

export default function AllParcelsPage() {
  const { parcels, updateParcelStatus } = useWorkerStore()
  const { isDark } = useThemeStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParcelId, setSelectedParcelId] = useState(parcels[0]?.id || '')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredParcels = parcels.filter((p) => {
    const matchesSearch =
      p.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sender_phone.includes(searchTerm) ||
      p.receiver_phone.includes(searchTerm) ||
      (p.load_id && p.load_id.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const selectedParcel = parcels.find((p) => p.id === selectedParcelId) || filteredParcels[0] || parcels[0]

  const handleStatusUpdate = (trackingNum, newStatus) => {
    updateParcelStatus(trackingNum, newStatus)
  }

  // ─── THEME CONSTANTS ───
  const cardBase = isDark
    ? 'bg-[#111827] border-slate-800/60 shadow-none'
    : 'bg-white border-slate-200/80 shadow-xs'

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500'
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-400'

  const borderLine = isDark ? 'border-slate-800/60' : 'border-slate-200'
  const bgSub = isDark ? 'bg-slate-800/40' : 'bg-slate-50'

  return (
    <div className={`space-y-4 p-1 sm:p-2 w-full font-sans ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>

      {/* Top Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-5 rounded-2xl border ${cardBase}`}>
        <div>
          <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 ${textPrimary}`}>
            <Layers className="w-5 h-5 text-emerald-500" />
            Parcel Registry & Load Board
          </h1>
          <p className={`text-xs font-medium ${textSecondary}`}>Select an intake on Panel 1 to dynamically update Panel 2 (Map) & Panel 3 (Details).</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input
            type="text"
            placeholder="Search Load #, sender, receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Main 3-Panel Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* PANEL 1: Left Vertical Column - Intake List (5 Cols Wide) */}
        <div className={`lg:col-span-5 flex flex-col border rounded-2xl p-4 space-y-3 h-full ${cardBase}`}>

          <div className={`border-b pb-2 space-y-2 ${borderLine}`}>
            <div className="flex items-center justify-between">
              <h2 className={`font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 ${textPrimary}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Panel 1: Intake Parcel Cards List
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDark ? 'text-slate-400 bg-slate-800 border-slate-700' : 'text-slate-500 bg-slate-100 border-slate-200'
              }`}>
                {filteredParcels.length} Items
              </span>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full border font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                All Intakes
              </button>
              <button
                onClick={() => setStatusFilter('in_transit')}
                className={`px-3 py-1 rounded-full border font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'in_transit'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                In Transit
              </button>
              <button
                onClick={() => setStatusFilter('ready_for_pickup')}
                className={`px-3 py-1 rounded-full border font-bold transition-colors whitespace-nowrap ${
                  statusFilter === 'ready_for_pickup'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                Ready Pickup
              </button>
            </div>
          </div>

          {/* Scrollable Intake Cards List */}
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredParcels.map((parcel) => {
              const isSelected = parcel.id === selectedParcel.id

              return (
                <div
                  key={parcel.id}
                  onClick={() => setSelectedParcelId(parcel.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? isDark
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm border-l-4 border-l-emerald-500'
                        : 'bg-emerald-50/50 border-emerald-500 shadow-sm border-l-4 border-l-emerald-500'
                      : isDark
                        ? 'bg-slate-800/20 border-slate-800/60 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isDark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        📦
                      </div>
                      <span className={`font-mono font-extrabold text-xs ${textPrimary}`}>{parcel.load_id || parcel.tracking_number}</span>
                    </div>

                    <div className="text-right">
                      <span className={`font-extrabold text-base ${textPrimary}`}>{parcel.price}</span>
                      <span className={`text-[10px] font-normal ml-1 ${textMuted}`}>{parcel.price_rate}</span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between text-xs pt-1 border-t ${borderLine}`}>
                    <div>
                      <div className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{parcel.sender_address.split(',')[0]}</div>
                      <div className={`text-[10px] ${textMuted}`}>{parcel.pickup_date}</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className={`text-[10px] font-semibold ${textSecondary}`}>{parcel.distance}</div>
                      <div className={`w-16 h-0.5 relative my-1 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 absolute left-0 top-1/2 -translate-y-1/2" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500 absolute right-0 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{parcel.receiver_address.split(',')[0]}</div>
                      <div className={`text-[10px] ${textMuted}`}>{parcel.delivery_date}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedParcelId(parcel.id)
                      }}
                      className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm shadow-emerald-900/20"
                    >
                      Select Intake
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedParcelId(parcel.id)
                      }}
                      className={`py-1.5 px-3 text-xs font-bold rounded-xl ${
                        isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN CONTAINER (7 Cols Wide) */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* PANEL 2: Right Top Section - Dynamic Route Map (Mapcn) */}
          <div className={`border rounded-2xl p-3 flex flex-col space-y-2 h-[350px] ${cardBase}`}>
            <div className={`flex items-center justify-between border-b pb-1.5 ${borderLine}`}>
              <h2 className={`font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 ${textPrimary}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Panel 2: Interactive Route Map (Mapcn)
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200'
              }`}>
                {selectedParcel?.load_id || selectedParcel?.tracking_number}
              </span>
            </div>

            <div className="flex-1 relative rounded-xl overflow-hidden">
              <ParcelMap
                parcel={selectedParcel}
                isDark={isDark}
              />
            </div>
          </div>

          {/* PANEL 3: Right Bottom Section - Contact & Transport Details */}
          {selectedParcel && (
            <div className={`border rounded-2xl p-4 space-y-3 ${cardBase}`}>
              <div className={`flex items-center justify-between border-b pb-2 ${borderLine}`}>
                <h2 className={`font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 ${textPrimary}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Panel 3: Contact & Vehicle / Driver Details
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {selectedParcel.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* 3-Column Contact & Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">

                {/* Sender Contact */}
                <div className={`p-3 rounded-xl border space-y-1 ${bgSub} ${borderLine}`}>
                  <div className={`flex items-center gap-1 font-bold uppercase text-[10px] ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                    <User className="w-3.5 h-3.5" />
                    Sender Contact
                  </div>
                  <div className={`font-extrabold text-xs pt-0.5 ${textPrimary}`}>{selectedParcel.sender_name}</div>
                  <div className={isDark ? 'text-slate-300' : 'text-slate-600'}>{selectedParcel.sender_phone}</div>
                  <div className={`text-[10px] truncate ${textMuted}`}>{selectedParcel.sender_email}</div>
                  <div className={`text-[10px] font-medium pt-1 border-t mt-1 leading-tight ${isDark ? 'text-slate-400 border-slate-700/50' : 'text-slate-700 border-slate-200'}`}>
                    {selectedParcel.sender_address}
                  </div>
                </div>

                {/* Receiver Contact */}
                <div className={`p-3 rounded-xl border space-y-1 ${bgSub} ${borderLine}`}>
                  <div className={`flex items-center gap-1 font-bold uppercase text-[10px] ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                    <MapPin className="w-3.5 h-3.5" />
                    Receiver Contact
                  </div>
                  <div className={`font-extrabold text-xs pt-0.5 ${textPrimary}`}>{selectedParcel.receiver_name}</div>
                  <div className={isDark ? 'text-slate-300' : 'text-slate-600'}>{selectedParcel.receiver_phone}</div>
                  <div className={`text-[10px] truncate ${textMuted}`}>{selectedParcel.receiver_email}</div>
                  <div className={`text-[10px] font-medium pt-1 border-t mt-1 leading-tight ${isDark ? 'text-slate-400 border-slate-700/50' : 'text-slate-700 border-slate-200'}`}>
                    {selectedParcel.receiver_address}
                  </div>
                </div>

                {/* Vehicle & Driver Details */}
                <div className={`p-3 rounded-xl border space-y-1 ${bgSub} ${borderLine}`}>
                  <div className={`flex items-center gap-1 font-bold uppercase text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    <Truck className="w-3.5 h-3.5" />
                    Vehicle & Driver Details
                  </div>
                  <div className={`font-extrabold text-xs pt-0.5 ${textPrimary}`}>{selectedParcel.driver_name}</div>
                  <div className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <Phone className={`w-3 h-3 ${textMuted}`} />
                    {selectedParcel.driver_phone}
                  </div>
                  <div className={`pt-1 border-t mt-1 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <div className={`text-[9px] uppercase font-bold ${textMuted}`}>Vehicle License Plate</div>
                    <div className={`font-mono font-black text-xs px-2 py-0.5 rounded border inline-block mt-0.5 ${
                      isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}>
                      {selectedParcel.vehicle_plate}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className={`flex flex-wrap gap-2 pt-2 border-t ${borderLine}`}>
                <button
                  onClick={() => handleStatusUpdate(selectedParcel.tracking_number, 'ready_for_pickup')}
                  className="px-3.5 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold rounded-xl hover:bg-amber-500/20"
                >
                  Mark Ready for Pickup
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedParcel.tracking_number, 'in_transit')}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm shadow-emerald-900/20"
                >
                  Dispatch Delivery Route
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedParcel.tracking_number, 'delivered')}
                  className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl hover:bg-emerald-500/20"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
