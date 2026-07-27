import { useState } from 'react'
import { Search, Filter, Phone, Truck, User, MapPin, CheckCircle2, Copy, X, SlidersHorizontal, Layers } from 'lucide-react'
import { useWorkerStore } from '../store/useWorkerStore'
import { ParcelMap } from '../components/ParcelMap'

export default function AllParcelsPage() {
  const { parcels, updateParcelStatus } = useWorkerStore()
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

  return (
    <div className="space-y-4 p-1 sm:p-2 text-slate-800 w-full">

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 px-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Parcel Registry & Load Board
          </h1>
          <p className="text-xs text-slate-500 font-medium">Select an intake on Panel 1 to dynamically update Panel 2 (Map) & Panel 3 (Details).</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Load #, sender, receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Main 3-Panel Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* PANEL 1: Left Vertical Column - Intake List (5 Cols Wide) */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-3 h-full">

          <div className="border-b border-slate-200 pb-2 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Panel 1: Intake Parcel Cards List
              </h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {filteredParcels.length} Items
              </span>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full border font-bold transition-colors whitespace-nowrap ${statusFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
              >
                All Intakes
              </button>
              <button
                onClick={() => setStatusFilter('in_transit')}
                className={`px-3 py-1 rounded-full border font-bold transition-colors whitespace-nowrap ${statusFilter === 'in_transit' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
              >
                In Transit
              </button>
              <button
                onClick={() => setStatusFilter('ready_for_pickup')}
                className={`px-3 py-1 rounded-full border font-bold transition-colors whitespace-nowrap ${statusFilter === 'ready_for_pickup' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
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
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm border-l-4 border-l-[#4f46e5]'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        📦
                      </div>
                      <span className="font-mono font-extrabold text-xs text-slate-900">{parcel.load_id || parcel.tracking_number}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-base text-slate-900">{parcel.price}</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-1">{parcel.price_rate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">{parcel.sender_address.split(',')[0]}</div>
                      <div className="text-[10px] text-slate-400">{parcel.pickup_date}</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <div className="text-[10px] font-semibold text-slate-500">{parcel.distance}</div>
                      <div className="w-16 h-0.5 bg-slate-300 relative my-1">
                        <div className="w-2 h-2 rounded-full bg-[#4f46e5] absolute left-0 top-1/2 -translate-y-1/2" />
                        <div className="w-2 h-2 rounded-full bg-[#4f46e5] absolute right-0 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-800">{parcel.receiver_address.split(',')[0]}</div>
                      <div className="text-[10px] text-slate-400">{parcel.delivery_date}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedParcelId(parcel.id)
                      }}
                      className="flex-1 py-1.5 bg-[#4f46e5] text-white text-xs font-bold rounded-xl hover:bg-[#4338ca] shadow-xs"
                    >
                      Select Intake
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedParcelId(parcel.id)
                      }}
                      className="py-1.5 px-3 bg-[#e2e8f0] text-slate-800 text-xs font-bold rounded-xl hover:bg-[#cbd5e1]"
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
          <div className="bg-white border border-slate-300 rounded-2xl p-3 shadow-sm flex flex-col space-y-2 h-[350px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Panel 2: Interactive Route Map (Mapcn)
              </h2>
              <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {selectedParcel?.load_id || selectedParcel?.tracking_number}
              </span>
            </div>

            <div className="flex-1 relative rounded-xl overflow-hidden">
              <ParcelMap
                parcel={selectedParcel}
                onStatusChange={(trackingNum, newStatus) => handleStatusUpdate(trackingNum, newStatus)}
              />
            </div>
          </div>

          {/* PANEL 3: Right Bottom Section - Contact & Transport Details */}
          {selectedParcel && (
            <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                  Panel 3: Contact & Vehicle / Driver Details
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedParcel.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* 3-Column Contact & Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">

                {/* Sender Contact */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1 text-indigo-700 font-bold uppercase text-[10px]">
                    <User className="w-3.5 h-3.5" />
                    Sender Contact
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 pt-0.5">{selectedParcel.sender_name}</div>
                  <div className="text-slate-600">{selectedParcel.sender_phone}</div>
                  <div className="text-[10px] text-slate-500 truncate">{selectedParcel.sender_email}</div>
                  <div className="text-[10px] font-medium text-slate-700 pt-1 border-t border-slate-200 mt-1 leading-tight">
                    {selectedParcel.sender_address}
                  </div>
                </div>

                {/* Receiver Contact */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1 text-blue-700 font-bold uppercase text-[10px]">
                    <MapPin className="w-3.5 h-3.5" />
                    Receiver Contact
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 pt-0.5">{selectedParcel.receiver_name}</div>
                  <div className="text-slate-600">{selectedParcel.receiver_phone}</div>
                  <div className="text-[10px] text-slate-500 truncate">{selectedParcel.receiver_email}</div>
                  <div className="text-[10px] font-medium text-slate-700 pt-1 border-t border-slate-200 mt-1 leading-tight">
                    {selectedParcel.receiver_address}
                  </div>
                </div>

                {/* Vehicle & Driver Details */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1 text-emerald-700 font-bold uppercase text-[10px]">
                    <Truck className="w-3.5 h-3.5" />
                    Vehicle & Driver Details
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 pt-0.5">{selectedParcel.driver_name}</div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {selectedParcel.driver_phone}
                  </div>
                  <div className="pt-1 border-t border-slate-200 mt-1">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Vehicle License Plate</div>
                    <div className="font-mono font-black text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mt-0.5">
                      {selectedParcel.vehicle_plate}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleStatusUpdate(selectedParcel.tracking_number, 'ready_for_pickup')}
                  className="px-3.5 py-1.5 bg-amber-500/10 text-amber-700 border border-amber-500/30 text-xs font-bold rounded-xl hover:bg-amber-500/20"
                >
                  Mark Ready for Pickup
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedParcel.tracking_number, 'in_transit')}
                  className="px-3.5 py-1.5 bg-[#4f46e5] text-white text-xs font-bold rounded-xl hover:bg-[#4338ca] shadow-xs"
                >
                  Dispatch Delivery Route
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedParcel.tracking_number, 'delivered')}
                  className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-xs font-bold rounded-xl hover:bg-emerald-500/20"
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
