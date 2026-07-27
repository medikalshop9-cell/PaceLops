import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, Truck, Ship, CheckCircle2, Download, Plus, ChevronDown,
  Calendar, Copy, ChevronLeft, ChevronRight, ArrowUpDown, Check, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react'
import { useWorkerStore } from '../store/useWorkerStore'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { parcels } = useWorkerStore()

  // Dynamic stat counts calculated directly from parcels state
  const totalShipments = parcels.length
  const inTransitCount = parcels.filter((p) => p.status === 'in_transit').length
  const pendingCount = parcels.filter((p) => p.status === 'pending' || p.status === 'ready_for_pickup').length
  const deliveredCount = parcels.filter((p) => p.status === 'delivered').length

  // State for timeframes and filters
  const [timeframe, setTimeframe] = useState('Feb 2022')
  const [chartTimeframe, setChartTimeframe] = useState('Feb 2023')
  const [copiedTracking, setCopiedTracking] = useState(false)

  // Live Tracking shipment carousel state derived from real parcels
  const liveShipments = parcels.length > 0 ? parcels.map((p) => ({
    trackingNumber: p.tracking_number,
    sender: p.sender_name,
    receiver: p.receiver_name,
    steps: [
      { label: 'Checking', time: '12:35', state: 'completed' },
      { label: 'In Transit', time: '02:00', state: p.status === 'in_transit' ? 'current' : p.status === 'delivered' ? 'completed' : 'upcoming' },
      { label: 'Out for Delivery', time: '12:00 (Nov 2, 2022)', state: p.status === 'delivered' ? 'current' : 'upcoming' },
    ],
  })) : [
    {
      trackingNumber: '#54hD-t780yb5',
      sender: 'Kwame Mensah',
      receiver: 'Abena Osei',
      steps: [
        { label: 'Checking', time: '12:35', state: 'completed' },
        { label: 'In Transit', time: '02:00', state: 'current' },
        { label: 'Out for Delivery', time: '12:00 (Nov 2, 2022)', state: 'upcoming' },
      ],
    }
  ]

  const [liveIndex, setLiveIndex] = useState(0)
  const currentLive = liveShipments[liveIndex % liveShipments.length] || liveShipments[0]

  // Chart data points & hover tooltip state
  const chartPoints = [
    { day: 1, val: 360, dateStr: 'Thu, Oct 1' },
    { day: 4, val: 580, dateStr: 'Sun, Oct 4' },
    { day: 7, val: 400, dateStr: 'Wed, Oct 7' },
    { day: 10, val: 420, dateStr: 'Sat, Oct 10' },
    { day: 13, val: 680, displayVal: '326,54', dateStr: 'Sun, Oct 13' },
    { day: 16, val: 260, dateStr: 'Wed, Oct 16' },
    { day: 19, val: 510, dateStr: 'Sat, Oct 19' },
    { day: 22, val: 460, dateStr: 'Tue, Oct 22' },
    { day: 25, val: 180, dateStr: 'Fri, Oct 25' },
  ]
  const [hoveredPointIndex, setHoveredPointIndex] = useState(4)

  // Incoming orders table state
  const [selectedOrders, setSelectedOrders] = useState([])

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(parcels.map((o) => o.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleToggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Copy tracking number to clipboard
  const handleCopyTracking = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedTracking(true)
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Name', 'Processing Status', 'Ship Status', 'Pro Date']
    const rows = parcels.map((o) => [o.tracking_number, o.sender_name, 'Processing', o.status, o.pickup_date])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `PaceLops_Shipments_${timeframe.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // SVG Chart Dimensions & Curves
  const chartHeight = 220
  const chartWidth = 720

  const pointsCoords = chartPoints.map((p, idx) => {
    const x = 40 + idx * 80
    const y = chartHeight - (p.val / 750) * (chartHeight - 40) - 20
    return { x, y, ...p }
  })

  const svgPath = pointsCoords.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`
    const prev = a[i - 1]
    const cx1 = prev.x + (point.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (point.x - prev.x) / 2
    const cy2 = point.y
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`
  }, '')

  const svgAreaPath = `${svgPath} L ${pointsCoords[pointsCoords.length - 1].x},${chartHeight - 10} L ${pointsCoords[0].x},${chartHeight - 10} Z`

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      
      {/* ─── Top Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-slate-400 block tracking-tight">Hello Admin,</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Good Morning</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Timeframe</span>
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2.5 pl-3.5 pr-8 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Feb 2022">Feb 2022</option>
                <option value="Mar 2022">Mar 2022</option>
                <option value="Jan 2023">Jan 2023</option>
                <option value="Feb 2023">Feb 2023</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-xs font-bold text-blue-600 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-blue-600" />
            Export CSV
          </button>

          <button
            onClick={() => navigate('/worker/create-shipment')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0066ff] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add new shipment
          </button>
        </div>
      </div>

      {/* ─── 100% DYNAMIC METRIC CARDS ROW ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Shipment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total shipment</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {totalShipments}
              </span>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ▲ {totalShipments} Items
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: In Transit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">In transit</span>
            <div className="mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {inTransitCount}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Packages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Pending packages</span>
            <div className="mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {pendingCount}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Delivered</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {deliveredCount}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ✓ {deliveredCount} Done
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Middle Section: Chart + Live Tracking ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chart Column (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Shipment Over Time</h2>
            <div className="relative">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{chartTimeframe}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto">
            <div className="min-w-[650px] relative">
              {pointsCoords[hoveredPointIndex] && (
                <div
                  className="absolute z-20 transition-all duration-200 -translate-x-1/2 pointer-events-none"
                  style={{
                    left: `${pointsCoords[hoveredPointIndex].x}px`,
                    top: `${pointsCoords[hoveredPointIndex].y - 45}px`,
                  }}
                >
                  <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{pointsCoords[hoveredPointIndex].dateStr}</span>
                    <span className="font-mono text-slate-200 border-l border-slate-700 pl-2">
                      {pointsCoords[hoveredPointIndex].displayVal || pointsCoords[hoveredPointIndex].val}
                    </span>
                  </div>
                </div>
              )}

              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[700, 500, 300, 100, 0].map((val) => {
                  const y = chartHeight - (val / 750) * (chartHeight - 40) - 20
                  return (
                    <g key={val}>
                      <line x1="30" y1={y} x2={chartWidth} y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
                      <text x="10" y={y + 4} fill="#94a3b8" fontSize="10" fontWeight="600">
                        {val}
                      </text>
                    </g>
                  )
                })}

                <path d={svgAreaPath} fill="url(#chartGradient)" />
                <path d={svgPath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

                {pointsCoords.map((pt, idx) => {
                  const isSelected = idx === hoveredPointIndex
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onClick={() => setHoveredPointIndex(idx)}
                    >
                      <text x={pt.x} y={chartHeight + 12} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
                        {pt.day}
                      </text>
                      <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                      {isSelected ? (
                        <>
                          <circle cx={pt.x} cy={pt.y} r="8" fill="#2563eb" fillOpacity="0.25" />
                          <circle cx={pt.x} cy={pt.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                        </>
                      ) : (
                        <circle cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Live Tracking Panel Overlay (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg space-y-5 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Live Tracking</h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLiveIndex((prev) => (prev > 0 ? prev - 1 : liveShipments.length - 1))}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLiveIndex((prev) => (prev < liveShipments.length - 1 ? prev + 1 : 0))}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400">Tracking Number:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-mono font-black text-slate-800">{currentLive.trackingNumber}</span>
              <button
                onClick={() => handleCopyTracking(currentLive.trackingNumber)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                title="Copy Tracking Number"
              >
                {copiedTracking ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              {copiedTracking && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
            </div>
          </div>

          <div className="space-y-4 pt-1 relative before:absolute before:left-[7px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 before:border-l before:border-dashed before:border-slate-300">
            {currentLive.steps.map((step, idx) => (
              <div key={idx} className="flex items-start justify-between relative pl-6">
                {step.state === 'completed' && (
                  <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white absolute left-0 top-0.5 shadow-xs" />
                )}
                {step.state === 'current' && (
                  <div className="w-4 h-4 rounded-full bg-white border-4 border-slate-900 absolute left-0 top-0.5 shadow-xs" />
                )}
                {step.state === 'upcoming' && (
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300 absolute left-0 top-0.5" />
                )}

                <div>
                  <div className={`text-xs font-extrabold ${step.state === 'upcoming' ? 'text-slate-400' : 'text-slate-900'}`}>
                    {step.label}
                  </div>
                </div>

                <div className={`text-xs font-mono ${step.state === 'upcoming' ? 'text-slate-400' : 'text-slate-700 font-bold'}`}>
                  {step.time}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/worker/parcels')}
            className="w-full py-3 bg-[#0066ff] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
          >
            <span>Track this order</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ─── Bottom Section: Incoming Orders Table (Dynamic Real-time List) ─── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Incoming Orders & Registrations</h2>
            <p className="text-xs text-slate-500">Live parcel records from customer submissions and worker intakes.</p>
          </div>
          <button
            onClick={() => navigate('/worker/parcels')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Registry →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === parcels.length && parcels.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Processing Status</th>
                <th className="py-3 px-3">Ship Status</th>
                <th className="py-3 px-3">Pro. Date</th>
                <th className="py-3 px-3">Order Number</th>
                <th className="py-3 px-3">Sender Name</th>
                <th className="py-3 px-3">Receiver Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parcels.map((order) => {
                const isChecked = selectedOrders.includes(order.id)
                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate('/worker/parcels')}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${isChecked ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelect(order.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'in_transit'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-emerald-500'
                              : order.status === 'in_transit'
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        {order.status === 'delivered' ? 'Completed' : order.status === 'in_transit' ? 'Processing' : 'Confirmed'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700 uppercase text-[11px]">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-medium">
                      {order.pickup_date}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono font-black text-slate-800">{order.tracking_number}</span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {order.sender_name}
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-semibold">
                      {order.receiver_name}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
