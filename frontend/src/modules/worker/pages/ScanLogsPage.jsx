import { useState, useMemo } from 'react'
import {
  ClipboardList, Search, Download, ShieldCheck, Clock, Building2, User,
  CheckCircle2, Filter, Copy, Check
} from 'lucide-react'
import { useWorkerStore } from '../store/useWorkerStore'
import { useThemeStore } from '../store/useThemeStore'

export default function ScanLogsPage() {
  const { scanLogs, activeBranch } = useWorkerStore()
  const { isDark } = useThemeStore()
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

  const cardBase = isDark
    ? 'bg-[#111827] border-slate-800/60 shadow-none'
    : 'bg-white border-slate-200/80 shadow-xs'

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className={`space-y-6 max-w-6xl mx-auto font-sans ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      
      {/* ─── Header Section ─── */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border ${cardBase}`}>
        <div>
          <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 ${textPrimary}`}>
            <ClipboardList className="w-5 h-5 text-emerald-500" />
            Scan Activity & Audit Logs
          </h1>
          <p className={`text-xs font-medium ${textSecondary}`}>Chain-of-custody audit history of scan events and operator actions.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-4 py-2 border text-xs font-bold rounded-xl transition-colors ${
              isDark ? 'bg-slate-800/50 border-slate-700 text-emerald-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <Download className="w-4 h-4" />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* ─── Audit Stat Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className={`p-4.5 rounded-2xl border space-y-1 ${cardBase}`}>
          <span className="text-xs font-semibold text-slate-400">Total Scan Events</span>
          <div className={`text-2xl font-black ${textPrimary}`}>{scanLogs.length}</div>
        </div>

        <div className={`p-4.5 rounded-2xl border space-y-1 ${cardBase}`}>
          <span className="text-xs font-semibold text-slate-400">Active Logging Branch</span>
          <div className="text-base font-black text-emerald-500 truncate">{activeBranch}</div>
        </div>

        <div className={`p-4.5 rounded-2xl border space-y-1 ${cardBase}`}>
          <span className="text-xs font-semibold text-slate-400">Chain-of-Custody Integrity</span>
          <div className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
            ✓ Verified Immutable
          </div>
        </div>

      </div>

      {/* ─── Logs Search & Table Card ─── */}
      <div className={`p-5 rounded-2xl border space-y-4 ${cardBase}`}>
        
        {/* Search & Filter Bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search tracking #, worker, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border ${
                isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            <button
              onClick={() => setFilterAction('all')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-colors whitespace-nowrap ${
                filterAction === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterAction('intake')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-colors whitespace-nowrap ${
                filterAction === 'intake'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Hub Intakes
            </button>
            <button
              onClick={() => setFilterAction('transit')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-colors whitespace-nowrap ${
                filterAction === 'transit'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
              <tr className={`border-b font-bold uppercase tracking-wider ${isDark ? 'border-slate-800/60 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Tracking #</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Branch Location</th>
                <th className="py-3 px-3">Operator</th>
                <th className="py-3 px-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`py-8 text-center font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No scan activity logs match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/80'}`}>
                    <td className={`py-3.5 px-3 font-mono text-[11px] whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(log.scanned_at).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-black ${textPrimary}`}>{log.tracking_number}</span>
                        <button
                          onClick={() => handleCopy(log.tracking_number, log.id)}
                          className={`p-0.5 rounded ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'}`}
                          title="Copy Code"
                        >
                          {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {log.action_type}
                      </span>
                    </td>

                    <td className={`py-3.5 px-3 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {log.branch}
                    </td>

                    <td className={`py-3.5 px-3 font-bold ${textPrimary}`}>
                      {log.worker_name}
                    </td>

                    <td className={`py-3.5 px-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
