import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Package, Clock, Truck, CheckCircle2,
  AlertTriangle, RotateCcw, PackageCheck, X, Copy, Check,
  ArrowRight, Box, User, Phone, Mail, Calendar, Zap,
  ChevronRight, PackageSearch, ScanLine, MessageCircle,
  Sparkles, Navigation, Weight, Hash, Shield, ExternalLink, ChevronDown, ArrowLeft, Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackParcel } from '../services/tracking.service'
import { mockParcels } from '../data/mockParcels'
import { Map, MapMarker, MarkerContent, MapRoute } from '@/components/ui/map'

// ─────────────────────────────────────────────
// STATUS CONFIG (FR-010)
// ─────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    glow: 'shadow-amber-500/20',
    gradient: 'from-amber-500/20 via-amber-400/5 to-transparent',
    ring: 'ring-amber-500/20',
  },
  in_transit: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-500',
    glow: 'shadow-indigo-500/20',
    gradient: 'from-indigo-500/20 via-indigo-400/5 to-transparent',
    ring: 'ring-indigo-500/20',
  },
  ready_for_pickup: {
    label: 'Ready for Pickup',
    icon: MapPin,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    dot: 'bg-teal-500',
    glow: 'shadow-teal-500/20',
    gradient: 'from-teal-500/20 via-teal-400/5 to-transparent',
    ring: 'ring-teal-500/20',
  },
  collected: {
    label: 'Collected',
    icon: PackageCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-500',
    glow: 'shadow-blue-500/20',
    gradient: 'from-blue-500/20 via-blue-400/5 to-transparent',
    ring: 'ring-blue-500/20',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    gradient: 'from-emerald-500/20 via-emerald-400/5 to-transparent',
    ring: 'ring-emerald-500/20',
  },
  returned: {
    label: 'Returned',
    icon: RotateCcw,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    dot: 'bg-orange-500',
    glow: 'shadow-orange-500/20',
    gradient: 'from-orange-500/20 via-orange-400/5 to-transparent',
    ring: 'ring-orange-500/20',
  },
  lost: {
    label: 'Lost',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
    glow: 'shadow-red-500/20',
    gradient: 'from-red-500/20 via-red-400/5 to-transparent',
    ring: 'ring-red-500/20',
  },
}

const STATUS_STEPS = ['pending', 'in_transit', 'ready_for_pickup', 'collected', 'delivered']

const RECENT_KEY = 'pacelops_recent_tracks'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-GH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}

function saveRecent(val) {
  const prev = getRecent().filter(v => v !== val)
  const next = [val, ...prev].slice(0, 5)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

function removeRecent(val) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter(v => v !== val)))
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/* ── Idle State ── */
function IdleState({ onTrack }) {
  const [showParcels, setShowParcels] = useState(false)

  // Sort user's current parcels by most recent event time (descending)
  const userParcels = [...mockParcels]
    .sort((a, b) => {
      const timeA = a.timeline?.at(-1)?.time ? new Date(a.timeline.at(-1).time).getTime() : 0
      const timeB = b.timeline?.at(-1)?.time ? new Date(b.timeline.at(-1).time).getTime() : 0
      return timeB - timeA
    })
    .slice(0, 4) // show up to 4

  return (
    <div className="flex flex-col items-center pt-12 sm:pt-16 pb-6 w-full">
      {/* Animated floating illustration */}
      <div className="relative mb-8 animate-float">
        {/* Glow behind */}
        <div className="absolute inset-0 rounded-[28px] bg-primary/15 blur-2xl scale-110" />
        <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
          <PackageSearch className="w-14 h-14 text-primary drop-shadow-sm" />
        </div>
        {/* Orbiting badge */}
        <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center animate-pulse">
          <ScanLine className="w-4.5 h-4.5 text-primary" />
        </div>
        {/* Second floating pill */}
        <div className="absolute -bottom-2 -left-3 px-2.5 py-1.5 rounded-xl bg-card border border-border shadow-lg flex items-center gap-1.5" style={{ animationDelay: '150ms' }}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground">Live</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2.5 tracking-tight text-center">Track Any Parcel</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed text-center mb-10">
        Enter a tracking number above, or tap one of your shipments below to track it instantly.
      </p>

      {/* ── Your Shipments — Quick Track Dropdown ── */}
      {userParcels.length > 0 && (
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setShowParcels(!showParcels)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all group hover:border-primary/20 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-foreground leading-none">Your Shipments</span>
                <span className="block text-[11px] font-medium text-muted-foreground mt-1">Tap to track recent parcels</span>
              </div>
            </div>
            <div className={cn(
              "w-7 h-7 bg-muted flex items-center justify-center rounded-full transition-transform duration-300",
              showParcels ? "rotate-180" : ""
            )}>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </button>

          <div className={cn(
            "grid transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            showParcels ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              <div className="stagger-children space-y-2.5 pt-1">
                {userParcels.map((parcel) => {
                  const cfg = STATUS_CONFIG[parcel.status] || STATUS_CONFIG.pending
                  const StatusIcon = cfg.icon
                  const lastEvent = parcel.timeline?.at(-1)

                  return (
                    <button
                      key={parcel.id}
                      onClick={() => onTrack(parcel.trackingNumber)}
                      className="w-full text-left group/card relative overflow-hidden rounded-[20px] border border-border bg-card dark:bg-card/60 p-4 sm:p-5 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] hover:border-primary/20 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {/* Subtle gradient on hover */}
                      <div className={cn('absolute inset-0 bg-gradient-to-r opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none', cfg.gradient)} />

                      <div className="relative flex items-center gap-4">
                        {/* Status icon */}
                        <div className={cn(
                          'w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all',
                          cfg.bg, cfg.border,
                          'group-hover/card:shadow-md', cfg.glow,
                        )}>
                          <StatusIcon className={cn('w-5 h-5', cfg.color)} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-foreground font-mono tracking-wide">{parcel.trackingNumber}</span>
                            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-lg', cfg.bg, cfg.color)}>
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 shrink-0 text-primary/50" />
                              {parcel.currentBranch}
                            </span>
                            {lastEvent && (
                              <span className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3" />
                                {timeAgo(lastEvent.time)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-all duration-200">
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/card:text-primary-foreground transition-colors" />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Not Found State ── */
function NotFoundState({ query, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
      <div className="relative mb-8 animate-float">
        <div className="absolute inset-0 rounded-[28px] bg-muted blur-2xl scale-110" />
        <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-muted via-muted/80 to-muted/50 flex items-center justify-center border border-border shadow-lg">
          <Package className="w-14 h-14 text-muted-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-red-500/10 border border-red-500/20 shadow-lg flex items-center justify-center">
          <X className="w-4 h-4 text-red-500" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2.5 tracking-tight">Parcel Not Found</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        No parcel matched <span className="font-bold text-foreground font-mono bg-muted px-1.5 py-0.5 rounded-md">"{query}"</span>.
        <br />Check for typos and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
      >
        <Search className="w-4 h-4" />
        Try Another
      </button>
    </div>
  )
}

/* ── Shimmer Skeleton ── */
function SearchSkeleton() {
  return (
    <div className="space-y-5">
      {/* Hero skeleton */}
      <div className="rounded-[24px] glass-card p-6 sm:p-8 space-y-5">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full w-24 animate-pulse" />
            <div className="h-7 bg-muted rounded-xl w-44 animate-pulse" />
          </div>
          <div className="h-9 bg-muted rounded-2xl w-28 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-18 bg-muted rounded-2xl animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="h-18 bg-muted rounded-2xl animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-muted animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
      {/* Tabs skeleton */}
      <div className="h-10 bg-muted rounded-2xl w-52 animate-pulse" />
      {/* Timeline skeleton */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
            <div className="flex-1 bg-muted rounded-2xl h-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Status Hero Card ── */
function StatusHeroCard({ parcel }) {
  const cfg = STATUS_CONFIG[parcel.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const stepIndex = STATUS_STEPS.indexOf(parcel.status)
  const progressIndex = stepIndex >= 0 ? stepIndex : STATUS_STEPS.length - 1
  const progressPct = STATUS_STEPS.length > 1
    ? Math.round((progressIndex / (STATUS_STEPS.length - 1)) * 100)
    : 0

  function copyTracking() {
    navigator.clipboard.writeText(parcel.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isTerminal = parcel.status === 'lost' || parcel.status === 'returned'
  const isComplete = parcel.status === 'delivered' || parcel.status === 'collected'

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-border glass-card animate-scale-up">
      {/* Gradient overlay */}
      <div className={cn('absolute inset-0 bg-gradient-to-br pointer-events-none', cfg.gradient)} />
      {/* Decorative blobs */}
      <div className={cn('absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.07] blur-3xl', cfg.dot)} />
      <div className={cn('absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-[0.05] blur-2xl', cfg.dot)} />

      <div className="relative p-6 sm:p-8 space-y-6">
        {/* Top row: Tracking ID + Status Badge */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Tracking Number</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono tracking-wide">{parcel.trackingNumber}</span>
              <button
                onClick={copyTracking}
                className={cn(
                  'p-2 rounded-xl transition-all duration-200 border',
                  copied
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 scale-95'
                    : 'bg-background/60 border-border text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm'
                )}
                title="Copy tracking number"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Status Badge — pill with glow */}
          <div className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-bold text-sm shadow-lg transition-all',
            cfg.bg, cfg.border, cfg.color, cfg.glow,
          )}>
            <Icon className="w-4 h-4" />
            <span>{cfg.label}</span>
          </div>
        </div>

        {/* Info grid: Location + ETA + Ship Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: Navigation,
              label: 'Current Location',
              value: parcel.currentBranch,
              accent: true,
            },
            {
              icon: Calendar,
              label: isComplete ? 'Delivered On' : 'Est. Delivery',
              value: isComplete
                ? formatDate(parcel.timeline?.at(-1)?.time)
                : parcel.estimatedDelivery ? formatDate(parcel.estimatedDelivery) : '—',
            },
            {
              icon: Clock,
              label: 'Shipped On',
              value: formatDate(parcel.createdAt),
            },
          ].map((item, idx) => {
            const ItemIcon = item.icon
            return (
              <div key={idx} className={cn(
                'rounded-2xl p-4 border transition-all',
                item.accent
                  ? 'bg-primary/5 border-primary/15 dark:bg-primary/5'
                  : 'bg-background/60 border-border/50 dark:bg-white/[0.03]'
              )}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1.5">{item.label}</p>
                <div className="flex items-center gap-2">
                  <ItemIcon className={cn('w-4 h-4 shrink-0', item.accent ? 'text-primary' : 'text-muted-foreground')} />
                  <p className="text-sm font-bold text-foreground truncate">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress Stepper (hide for terminal failures) */}
        {!isTerminal && (
          <div className="pt-2">
            {/* Steps Row */}
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => {
                const sCfg = STATUS_CONFIG[s]
                const done = i <= progressIndex
                const isCurrentStep = i === progressIndex
                const SIcon = sCfg.icon
                const isLast = i === STATUS_STEPS.length - 1

                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    {/* Step dot/icon */}
                    <div className="flex flex-col items-center gap-2 relative">
                      <div className={cn(
                        'w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 relative',
                        done
                          ? `${sCfg.bg} ${sCfg.border} shadow-md ${sCfg.glow}`
                          : 'bg-muted border-border'
                      )}>
                        <SIcon className={cn('w-4 h-4 transition-colors', done ? sCfg.color : 'text-muted-foreground/50')} />
                        {isCurrentStep && !isComplete && (
                          <span className={cn('absolute inset-0 rounded-2xl animate-ping opacity-20', sCfg.bg)} />
                        )}
                      </div>
                      <span className={cn(
                        'text-[9px] font-bold leading-tight text-center w-16 sm:w-20 hidden sm:block',
                        done ? 'text-foreground' : 'text-muted-foreground/60'
                      )}>
                        {sCfg.label}
                      </span>
                    </div>
                    {/* Connector line */}
                    {!isLast && (
                      <div className="flex-1 h-0.5 mx-1 rounded-full relative overflow-hidden bg-muted">
                        <div
                          className={cn(
                            'absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out',
                            i < progressIndex ? 'bg-primary' : 'bg-transparent'
                          )}
                          style={{ width: i < progressIndex ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Terminal failure alert */}
        {isTerminal && (
          <div className={cn(
            'rounded-2xl border p-5 flex items-start gap-4',
            cfg.border,
            'bg-background/60 dark:bg-white/[0.03]',
          )}>
            <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center shrink-0', cfg.bg)}>
              <AlertTriangle className={cn('w-5 h-5', cfg.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground mb-1">
                {parcel.status === 'lost' ? 'Parcel Reported Lost' : 'Parcel Returned to Sender'}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {parcel.status === 'lost'
                  ? 'An investigation has been opened. Contact support for updates and reimbursement options.'
                  : 'Delivery failed after multiple attempts. The parcel is being returned to the origin branch.'}
              </p>
            </div>
            <button 
              onClick={() => navigate('/customer/support')}
              className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border shrink-0 transition-all hover:shadow-md',
              cfg.bg, cfg.border, cfg.color, cfg.glow,
            )}>
              <MessageCircle className="w-3.5 h-3.5" />
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Timeline Step ── */
function TimelineStep({ event, index, total, parcelStatus }) {
  const cfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  const isFirst = index === 0 // first = most recent (reversed order)
  const isLast = index === total - 1
  const isActive = isFirst && !['delivered', 'collected', 'returned', 'lost'].includes(parcelStatus)

  return (
    <div className="relative flex gap-4 group">
      {/* Vertical connector */}
      {!isLast && (
        <div className={cn(
          'absolute left-[23px] sm:left-[25px] top-[52px] bottom-0 w-[2px] transition-colors',
          isFirst ? cfg.dot : 'bg-border'
        )} style={{ opacity: isFirst ? 0.3 : 1 }} />
      )}

      {/* Icon node */}
      <div className={cn(
        'relative shrink-0 w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-2xl border-2 flex items-center justify-center z-10 transition-all duration-300',
        isFirst
          ? `${cfg.bg} ${cfg.border} shadow-lg ${cfg.glow}`
          : 'bg-card dark:bg-card/60 border-border group-hover:border-primary/20'
      )}>
        <Icon className={cn('w-5 h-5 transition-colors', isFirst ? cfg.color : 'text-muted-foreground group-hover:text-foreground')} />
        {isActive && (
          <>
            <span className={cn('absolute inset-0 rounded-2xl animate-ping opacity-20', cfg.bg)} />
            <div className={cn('absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card', cfg.dot)}>
              <div className={cn('absolute inset-0 rounded-full animate-pulse', cfg.dot)} />
            </div>
          </>
        )}
      </div>

      {/* Content card */}
      <div className={cn(
        'flex-1 mb-4 rounded-2xl border transition-all duration-300 overflow-hidden',
        isFirst
          ? 'bg-card dark:bg-card/80 border-border shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)]'
          : 'bg-transparent dark:bg-transparent border-transparent hover:bg-card/50 dark:hover:bg-card/30 hover:border-border'
      )}>
        {/* Accent bar for active step */}
        {isFirst && <div className={cn('h-[3px]', cfg.dot)} />}

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <p className={cn('text-sm font-bold leading-snug', isFirst ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground transition-colors')}>
              {event.description}
            </p>
            <span className={cn(
              'text-[10px] font-bold px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap',
              isFirst ? `${cfg.bg} ${cfg.color}` : 'bg-muted text-muted-foreground'
            )}>
              {cfg.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <MapPin className="w-3 h-3 shrink-0 text-primary/60" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Clock className="w-3 h-3 shrink-0" />
              {formatDateTime(event.time)}
            </span>
            {event.worker && event.worker !== 'System' && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Shield className="w-3 h-3 shrink-0" />
                {event.worker}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Timeline wrapper ── */
function TrackingTimeline({ parcel }) {
  const reversed = [...(parcel.timeline || [])].reverse()
  return (
    <div className="pt-2 stagger-children">
      {reversed.map((event, i) => (
        <TimelineStep
          key={event.id || i}
          event={event}
          index={i}
          total={reversed.length}
          parcelStatus={parcel.status}
        />
      ))}
    </div>
  )
}

/* ── Details Panel ── */
function ParcelDetailsPanel({ parcel }) {
  const cfg = STATUS_CONFIG[parcel.status] || STATUS_CONFIG.pending

  return (
    <div className="space-y-5 pt-2 stagger-children">
      {/* Sender & Receiver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Sender', person: parcel.sender, gradient: 'from-blue-500/10 to-transparent' },
          { label: 'Receiver', person: parcel.receiver, gradient: 'from-emerald-500/10 to-transparent' },
        ].map(({ label, person, gradient }) => (
          <div key={label} className="relative overflow-hidden bg-card dark:bg-card/60 border border-border rounded-[22px] p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 group">
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none', gradient)} />
            <div className="relative">
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground mb-4 flex items-center gap-2.5">
                <div className="p-1.5 bg-muted rounded-lg border border-border">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                {label}
              </h3>
              <div className="space-y-3.5">
                <p className="font-bold text-base text-foreground tracking-tight">{person.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{person.address}</p>
                <div className="pt-3.5 border-t border-border/50 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground/60" />{person.phone}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />{person.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parcel Info */}
      <div className="relative overflow-hidden bg-card dark:bg-card/60 border border-border rounded-[22px] p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative">
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground mb-5 flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/15"><Box className="w-3.5 h-3.5 text-primary" /></div>
            Parcel Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-5">
            {[
              { label: 'Type', value: parcel.parcelInfo.type, icon: Package },
              { label: 'Weight', value: parcel.parcelInfo.weight, icon: Weight },
              { label: 'Est. Value', value: parcel.parcelInfo.estimatedValue, icon: Zap },
              { label: 'Payment', value: parcel.paymentStatus, icon: CheckCircle2, paid: true },
            ].map((item, idx) => {
              const ItemIcon = item.icon
              return (
                <div key={idx}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">{item.label}</p>
                  {item.paid ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.value}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ItemIcon className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  )}
                </div>
              )
            })}
            {parcel.parcelInfo.instructions && (
              <div className="col-span-2 sm:col-span-4 pt-4 border-t border-border">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Special Instructions</p>
                <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground leading-relaxed">{parcel.parcelInfo.instructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logistics */}
      <div className="relative overflow-hidden bg-card dark:bg-card/60 border border-border rounded-[22px] p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative">
          <h3 className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground mb-5 flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/15"><Truck className="w-3.5 h-3.5 text-primary" /></div>
            Logistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Method</p>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                <p className="text-sm font-semibold text-foreground">{parcel.deliveryMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Speed</p>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-muted-foreground/60" />
                <p className="text-sm font-semibold text-foreground">{parcel.deliverySpeed}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Pickup Appointment</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                <p className="text-sm font-semibold text-foreground">{formatDateTime(parcel.pickupAppointment)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LIVE MAP PANEL
// ─────────────────────────────────────────────
const CITY_COORDS = {
  'Accra Central': [-0.2057, 5.556],
  'Kumasi Main Hub': [-1.6163, 6.6885],
  'Takoradi': [-1.761, 4.894],
  'Tema': [-0.0166, 5.6667],
  'Spintex': [-0.1417, 5.626],
  'Ridge': [-0.1932, 5.559],
  'Unknown': [-0.2057, 5.556],
}

function getCoords(locationStr) {
  if (!locationStr) return CITY_COORDS['Accra Central']
  const loc = Object.keys(CITY_COORDS).find(k => locationStr.includes(k))
  return loc ? CITY_COORDS[loc] : CITY_COORDS['Accra Central']
}

function LiveMapPanel({ parcel }) {
  const cfg = STATUS_CONFIG[parcel.status] || STATUS_CONFIG.pending
  
  const originLoc = parcel.timeline?.[0]?.location || 'Accra Central'
  const destLoc = parcel.receiver.address || 'Kumasi Main Hub'
  const currentLoc = parcel.currentBranch || originLoc

  const originCoords = getCoords(originLoc)
  const destCoords = getCoords(destLoc)
  
  // If we are at origin or destination exactly, just use those coords, else interpolate slightly for effect
  const isComplete = parcel.status === 'delivered' || parcel.status === 'collected'
  const currentCoords = isComplete ? destCoords : getCoords(currentLoc)

  const center = [
    (originCoords[0] + destCoords[0]) / 2,
    (originCoords[1] + destCoords[1]) / 2
  ]

  // Add some slight curvature or middle points to the route
  const midPoint = [
    originCoords[0] + (destCoords[0] - originCoords[0]) * 0.5 - 0.2, // offset longitude to create a bow
    originCoords[1] + (destCoords[1] - originCoords[1]) * 0.5
  ]

  const mockRoute = [
    originCoords,
    midPoint,
    destCoords
  ]

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-[24px] shadow-[var(--card-shadow)] h-[450px] mt-4 animate-scale-up group">
      <Map
        viewport={{
          center: center,
          zoom: 6.5,
          pitch: 45
        }}
        className="w-full h-full"
      >
        {/* Origin Marker */}
        <MapMarker longitude={originCoords[0]} latitude={originCoords[1]}>
          <MarkerContent>
            <div className="relative w-5 h-5 rounded-full border-4 border-card bg-primary shadow-lg flex items-center justify-center z-10" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-background border border-border rounded-md shadow-sm text-[10px] font-bold text-muted-foreground whitespace-nowrap">Origin</div>
          </MarkerContent>
        </MapMarker>

        {/* Destination Marker */}
        <MapMarker longitude={destCoords[0]} latitude={destCoords[1]}>
          <MarkerContent>
            <div className="relative flex flex-col items-center">
              <MapPin className="w-7 h-7 text-red-500 drop-shadow-md z-10 relative -top-3" />
              <div className="w-3 h-1.5 bg-black/20 rounded-full blur-[2px] absolute bottom-0" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-background border border-border rounded-md shadow-sm text-[10px] font-bold text-muted-foreground whitespace-nowrap">Destination</div>
          </MarkerContent>
        </MapMarker>

        {/* Route Line */}
        <MapRoute
          coordinates={mockRoute}
          color="#3b82f6"
          width={4}
          opacity={0.5}
          dashArray={[2, 2]}
        />

        {/* Current Location (Truck) */}
        {!isComplete && parcel.status !== 'pending' && (
          <MapMarker longitude={currentCoords[0]} latitude={currentCoords[1]}>
            <MarkerContent>
              <div className={cn("w-11 h-11 rounded-2xl bg-card border flex items-center justify-center shadow-xl relative z-20 transition-transform hover:scale-110", cfg.border)}>
                <span className={cn('absolute inset-0 rounded-2xl animate-ping opacity-20', cfg.bg)} />
                <Truck className={cn("w-5 h-5", cfg.color)} />
              </div>
            </MarkerContent>
          </MapMarker>
        )}
      </Map>

      {/* Gradients to blend map seamlessly */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-card/80 to-transparent pointer-events-none" />
      
      {/* Live Indicator overlay */}
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-card/80 backdrop-blur-md border border-border shadow-lg flex items-center gap-2 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-bold text-foreground">Live GPS Tracker</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function TrackParcelPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [result, setResult] = useState(null)
  const [pageStatus, setPageStatus] = useState('idle') // idle | loading | found | not_found
  const [activeTab, setActiveTab] = useState('live_map')
  const [recent, setRecent] = useState(getRecent)
  const inputRef = useRef(null)
  const resultRef = useRef(null)

  const handleSearch = useCallback(async (value) => {
    const val = (value ?? query).trim()
    if (!val) return
    setPageStatus('loading')
    setResult(null)
    setActiveTab('live_map')
    try {
      const data = await trackParcel(val)
      setResult(data)
      setPageStatus('found')
      saveRecent(val)
      setRecent(getRecent())
      // Smooth scroll to results after short delay for animation
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch {
      setPageStatus('not_found')
    }
  }, [query])

  // Auto-search on mount if URL has ?q=
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) handleSearch(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleRecentClick(val) {
    setQuery(val)
    handleSearch(val)
  }

  function handleRemoveRecent(e, val) {
    e.stopPropagation()
    removeRecent(val)
    setRecent(getRecent())
  }

  function handleClear() {
    setQuery('')
    setResult(null)
    setPageStatus('idle')
    inputRef.current?.focus()
  }

  return (
    <div className="py-8 sm:py-10 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Back Button */}
      {pageStatus !== 'idle' && (
        <div className="px-1 -mb-2 animate-in fade-in slide-in-from-left-2 duration-300">
          <button
            onClick={handleClear}
            className="group flex items-center gap-2 px-3 py-1.5 -ml-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to tracking
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="px-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Track Your Parcel</h1>
            <p className="text-muted-foreground text-sm">Real-time status, location history & delivery details</p>
          </div>
        </div>
      </div>

      {/* Search Bar — Premium card */}
      <div className="glass-card rounded-[24px] p-5 sm:p-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-muted/80 dark:bg-white/[0.04] border border-border rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all duration-200 group">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter tracking number e.g. TRK987654321"
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground font-medium"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button onClick={handleClear} className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/60">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || pageStatus === 'loading'}
            className="px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shrink-0"
          >
            {pageStatus === 'loading'
              ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              : <Search className="w-4 h-4" />
            }
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Recent searches */}
        {recent.length > 0 && (pageStatus === 'idle' || pageStatus === 'not_found') && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mr-1">Recent</span>
            {recent.map(val => (
              <button
                key={val}
                onClick={() => handleRecentClick(val)}
                className="group/chip flex items-center gap-1.5 px-3 py-1.5 bg-muted/80 hover:bg-accent border border-border hover:border-primary/20 rounded-xl text-xs font-semibold text-foreground transition-all duration-200 hover:shadow-sm"
              >
                <Search className="w-3 h-3 text-muted-foreground group-hover/chip:text-primary transition-colors" />
                <span className="font-mono">{val}</span>
                <span
                  onClick={e => handleRemoveRecent(e, val)}
                  className="ml-0.5 p-0.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-md transition-colors"
                  role="button"
                  tabIndex={0}
                >
                  <X className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Area */}
      <div ref={resultRef}>
        {pageStatus === 'idle' && <IdleState onTrack={handleSearch} />}
        {pageStatus === 'loading' && <SearchSkeleton />}
        {pageStatus === 'not_found' && <NotFoundState query={query} onRetry={handleClear} />}
        {pageStatus === 'found' && result && (
          <div className="space-y-5">
            {/* Status Hero */}
            <StatusHeroCard parcel={result} />

            {/* Tab Switcher */}
            <div className="flex gap-1 bg-muted/80 dark:bg-muted p-1.5 rounded-2xl w-fit shadow-inner">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock, count: result.timeline?.length },
                { id: 'live_map', label: 'Live Map', icon: Globe },
                { id: 'details', label: 'Details', icon: Package },
              ].map(tab => {
                const TabIcon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
                      isActive
                        ? 'bg-card text-foreground shadow-md border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <TabIcon className={cn('w-4 h-4', isActive && 'text-primary')} />
                    {tab.label}
                    {tab.count != null && (
                      <span className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums',
                        isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div key={activeTab} className="animate-scale-up">
              {activeTab === 'timeline' && <TrackingTimeline parcel={result} />}
              {activeTab === 'live_map' && <LiveMapPanel parcel={result} />}
              {activeTab === 'details' && <ParcelDetailsPanel parcel={result} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
