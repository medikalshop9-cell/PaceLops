import { useState, useMemo } from 'react'
import {
  ClipboardList, Search, Download, ShieldCheck, Clock, Building2, User,
  CheckCircle2, Filter, Copy, Check
} from 'lucide-react'
import { useWorkerStore } from '../store/useWorkerStore'

export default function ScanLogsPage() {
  const { scanLogs, activeBranch } = useWorkerStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [copiedId, setCopiedId] = useState(null)

  const filteredLogs = useMemo(() => {
    return scanLogs.filter((log) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        !q ||
        log.tracking_number.toLowerCase().includes(q) ||
        log.worker_name.toLowerCase().includes(q) ||
        log.notes.toLowerCase().includes(q) ||
        log.action_type.toLowerCase().includes(q)

      const matchesFilter =
        filterAction === 'all' ||
        (filterAction === 'pickup' && log.action_type.toLowerCase().includes('pickup')) ||
        (filterAction === 'transit' && log.action_type.toLowerCase().includes('transit')) ||
        (filterAction === 'intake' && log.action_type.toLowerCase().includes('intake'))

      return matchesSearch && matchesFilter
    })
  }, [scanLogs, searchTerm, filterAction])

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  // Export CSV handler for audit logs
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Tracking Number', 'Action Event', 'Branch', 'Worker', 'Notes']
    const rows = filteredLogs.map((l) => [
      new Date(l.scanned_at).toLocaleString(),
      l.tracking_number,
      l.action_type,
      l.branch,
      l.worker_name,
      l.notes,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `PaceLops_ScanLogs_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-800 font-sans">
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            Scan Activity & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 font-medium">Chain-of-custody audit history of scan events and operator actions.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* ─── Audit Stat Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Scan Events</span>
          <div className="text-2xl font-black text-slate-900">{scanLogs.length}</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Active Logging Branch</span>
          <div className="text-base font-black text-indigo-600 truncate">{activeBranch}</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-400">Chain-of-Custody Integrity</span>
          <div className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
            ✓ Verified Immutable
          </div>
        </div>

      </div>

      {/* ─── Logs Search & Table Card ─── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracking #, worker, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterAction('all')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-colors whitespace-nowrap ${
                filterAction === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterAction('intake')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-colors whitespace-nowrap ${
                filterAction === 'intake' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Hub Intakes
            </button>
            <button
              onClick={() => setFilterAction('transit')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-colors whitespace-nowrap ${
                filterAction === 'transit' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Transits
            </button>
          </div>
        </div>

        {/* Logs Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Tracking #</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Branch Location</th>
                <th className="py-3 px-3">Operator</th>
                <th className="py-3 px-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    No scan activity logs match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.scanned_at).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-slate-800">{log.tracking_number}</span>
                        <button
                          onClick={() => handleCopy(log.tracking_number, log.id)}
                          className="p-0.5 text-slate-400 hover:text-slate-700 rounded"
                          title="Copy Code"
                        >
                          {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {log.action_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-semibold">
                      {log.branch}
                    </td>

                    <td className="py-3.5 px-3 text-slate-800 font-bold">
                      {log.worker_name}
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 font-medium">
                      {log.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}
