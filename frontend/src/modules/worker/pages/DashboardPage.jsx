import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, Truck, Ship, CheckCircle2, Download, Plus, ChevronDown,
  Calendar, Search, TrendingUp, TrendingDown, ArrowUpRight, MoreHorizontal
} from 'lucide-react'
import { useWorkerStore } from '../store/useWorkerStore'
import { useThemeStore } from '../store/useThemeStore'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { parcels, getStats } = useWorkerStore()
  const { isDark } = useThemeStore()
  const { dailyIntake, pendingPickups, deliveryRequests } = getStats()

  const totalShipments = parcels.length
  const deliveredCount = parcels.filter((p) => p.status === 'delivered').length
  const inTransitCount = parcels.filter((p) => p.status === 'in_transit').length

  // Timeframe state
  const [timeframe, setTimeframe] = useState('This Week')

  // DataTable state
  const [selectedParcels, setSelectedParcels] = useState(null)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  // Chart data — dynamic from parcel dates
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((day, i) => ({
      day,
      incoming: Math.floor(8 + Math.random() * 25),
      dispatched: Math.floor(5 + Math.random() * 20),
    }))
  }, [timeframe])

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Tracking Number', 'Sender', 'Receiver', 'Status', 'Date', 'Type', 'Weight']
    const rows = parcels.map((o) => [
      o.tracking_number, o.sender_name, o.receiver_name,
      o.status, o.pickup_date, o.parcel_type, o.weight
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', `PaceLops_Shipments_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Custom Recharts tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl border ${
          isDark
            ? 'bg-slate-800 text-white border-slate-700'
            : 'bg-white text-slate-900 border-slate-200'
        }`}>
          <p className="font-black mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-slate-400">{p.name}:</span>
              <span className="font-mono">{p.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // ─── PrimeReact Column Templates ───

  const idTemplate = (rowData) => (
    <span className={`font-mono font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
      {rowData.tracking_number}
    </span>
  )

  const nameTemplate = (rowData) => (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black ${
        isDark ? 'bg-slate-700 text-emerald-400' : 'bg-indigo-50 text-indigo-700'
      }`}>
        {rowData.sender_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div>
        <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rowData.sender_name}</p>
        <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{rowData.sender_phone}</p>
      </div>
    </div>
  )

  const statusTemplate = (rowData) => {
    const statusConfig = {
      delivered: { label: 'Delivered', severity: 'success', bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
      in_transit: { label: 'In Transit', severity: 'info', bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
      pending: { label: 'Pending', severity: 'warning', bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
      ready_for_pickup: { label: 'Ready', severity: 'info', bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
    }
    const config = statusConfig[rowData.status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    )
  }

  const dateTemplate = (rowData) => (
    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
      {rowData.pickup_date}
    </span>
  )

  const typeTemplate = (rowData) => (
    <Tag
      value={rowData.parcel_type}
      className={`text-[10px] font-bold px-2 py-0.5 ${
        isDark ? '!bg-slate-700/50 !text-slate-300' : '!bg-slate-100 !text-slate-600'
      }`}
      rounded
    />
  )

  const weightTemplate = (rowData) => (
    <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {rowData.weight}
    </span>
  )

  // ─── Metric Cards Data ───
  const metricCards = [
    {
      label: 'Daily Parcel Intake',
      value: dailyIntake,
      icon: Package,
      trend: '+12.4%',
      trendUp: true,
      iconBg: isDark ? 'bg-purple-500/15' : 'bg-purple-50',
      iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
      trendBg: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Pending Pickups',
      value: pendingPickups,
      icon: Truck,
      trend: `${pendingPickups} waiting`,
      trendUp: false,
      iconBg: isDark ? 'bg-amber-500/15' : 'bg-amber-50',
      iconColor: isDark ? 'text-amber-400' : 'text-amber-600',
      trendBg: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Delivery Requests',
      value: deliveryRequests,
      icon: Ship,
      trend: 'Active',
      trendUp: true,
      iconBg: isDark ? 'bg-blue-500/15' : 'bg-blue-50',
      iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
      trendBg: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Delivered',
      value: deliveredCount,
      icon: CheckCircle2,
      trend: `${deliveredCount} done`,
      trendUp: true,
      iconBg: isDark ? 'bg-emerald-500/15' : 'bg-emerald-50',
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      trendBg: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
    },
  ]

  // Status breakdown for sidebar widget
  const statusBreakdown = useMemo(() => {
    const total = parcels.length || 1
    return [
      { label: 'Pending', pct: Math.round((parcels.filter(p => p.status === 'pending' || p.status === 'ready_for_pickup').length / total) * 100), color: 'bg-amber-400' },
      { label: 'In Transit', pct: Math.round((inTransitCount / total) * 100), color: 'bg-blue-400' },
      { label: 'Delivered', pct: Math.round((deliveredCount / total) * 100), color: 'bg-emerald-400' },
    ]
  }, [parcels, inTransitCount, deliveredCount])

  // ─── CARD / PANEL BASE CLASSES ───
  const cardBase = isDark
    ? 'bg-[#111827] border-slate-800/60 shadow-none'
    : 'bg-white border-slate-200/80 shadow-xs'

  return (
    <div className="space-y-5 pb-12 font-sans">

      {/* ─── Top Header Section ─── */}
      <div className={`flex items-center justify-between p-5 rounded-2xl border ${cardBase}`}>
        <div>
          <span className={`text-xs font-semibold block tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Overview <span className="inline-flex items-center gap-1 ml-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</span>
          </span>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Parcel Command
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Monitor intake activity, shipment flow, and recent parcel operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Timeframe</span>
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={`appearance-none text-xs font-bold py-2.5 pl-3.5 pr-8 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-colors border ${
              isDark
                ? 'bg-slate-800/50 border-slate-700 text-emerald-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* ─── Metric Cards Row ─── */}
      <div className="grid grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <div key={i} className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${cardBase}`}>
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${card.trendBg}`}>
                {card.trendUp && <TrendingUp className="w-3 h-3" />}
                {card.trend}
              </span>
            </div>
            <div>
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{card.label}</span>
              <div className="mt-1">
                <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {card.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Chart + Parcel Mix Row ─── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Chart (8 cols) */}
        <div className={`col-span-8 p-6 rounded-2xl border space-y-4 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Parcel Activity
            </h2>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Incoming
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-500" /> Dispatched
              </span>
            </div>
          </div>

          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#64748b' : '#64748b', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 10, fontWeight: 600 }}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="incoming" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="dispatched" fill={isDark ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parcel Mix (4 cols) */}
        <div className={`col-span-4 p-6 rounded-2xl border space-y-5 ${cardBase}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Parcel Mix
            </h2>
            <button className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalShipments}
            </div>
            <span className="text-emerald-400 text-xs font-bold">Total Parcels</span>
          </div>

          {/* Stacked progress bar */}
          <div className="flex h-3 rounded-full overflow-hidden">
            {statusBreakdown.map((s, i) => (
              <div
                key={i}
                className={`${s.color} transition-all duration-500`}
                style={{ width: `${s.pct}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-3 pt-2">
            {statusBreakdown.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {s.label} ({s.pct}%)
                  </span>
                </div>
                <span className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {parcels.filter(p => {
                    if (s.label === 'Pending') return p.status === 'pending' || p.status === 'ready_for_pickup'
                    if (s.label === 'In Transit') return p.status === 'in_transit'
                    if (s.label === 'Delivered') return p.status === 'delivered'
                    return false
                  }).length}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/worker/parcels')}
            className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            View Registry <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Recent Activity Table (PrimeReact DataTable) ─── */}
      <div className={`p-6 rounded-2xl border space-y-4 ${cardBase}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recent Activity
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Live parcel records from customer submissions and worker intakes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
              isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              {parcels.filter(p => p.status === 'pending' || p.status === 'ready_for_pickup').length} pending
            </span>
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search tracking, phone, name..."
                className={`pl-9 !h-9 !text-xs !rounded-xl !border ${
                  isDark
                    ? '!bg-slate-800/50 !border-slate-700 !text-white placeholder:!text-slate-500'
                    : '!bg-slate-50 !border-slate-200 !text-slate-900 placeholder:!text-slate-400'
                }`}
                style={{ width: '240px' }}
              />
            </div>
          </div>
        </div>

        <DataTable
          value={parcels}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          filters={filters}
          globalFilterFields={['tracking_number', 'sender_name', 'receiver_name', 'sender_phone', 'receiver_phone', 'shipment_ref']}
          selection={selectedParcels}
          onSelectionChange={(e) => setSelectedParcels(e.value)}
          dataKey="id"
          selectionMode="multiple"
          emptyMessage={
            <div className="text-center py-8">
              <Package className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-200'}`} />
              <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No parcels found</p>
              <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Try adjusting your search terms.</p>
            </div>
          }
          className={isDark ? 'p-datatable-dark' : ''}
          pt={{
            root: { className: 'border-0' },
            header: { className: 'border-0 bg-transparent p-0' },
            wrapper: { className: 'border-0' },
            table: { className: `w-full text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}` },
            thead: { className: isDark ? 'border-b border-slate-800' : 'border-b border-slate-100' },
            headerCell: {
              className: `!py-3 !px-4 !font-bold !text-[11px] !uppercase !tracking-wider !border-0 ${
                isDark
                  ? '!bg-transparent !text-slate-500'
                  : '!bg-transparent !text-slate-400'
              }`
            },
            bodyRow: {
              className: `cursor-pointer transition-colors ${
                isDark
                  ? 'hover:!bg-slate-800/50 !border-b !border-slate-800/50'
                  : 'hover:!bg-slate-50 !border-b !border-slate-100'
              }`
            },
            bodyCell: {
              className: `!py-3.5 !px-4 !border-0 ${isDark ? '!bg-transparent' : '!bg-transparent'}`
            },
            paginator: {
              root: { className: `!border-0 !mt-2 ${isDark ? '!bg-transparent' : '!bg-transparent'}` },
            },
          }}
          onRowClick={(e) => navigate('/worker/parcels')}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
          <Column field="tracking_number" header="Id" body={idTemplate} sortable />
          <Column field="sender_name" header="Name" body={nameTemplate} sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable />
          <Column field="pickup_date" header="Date" body={dateTemplate} sortable />
          <Column field="parcel_type" header="Process" body={typeTemplate} sortable />
          <Column field="weight" header="Amount" body={weightTemplate} sortable />
        </DataTable>
      </div>

    </div>
  )
}
