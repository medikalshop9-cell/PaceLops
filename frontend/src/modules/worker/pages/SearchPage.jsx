import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  ScanLine, Search, Package, MapPin, User, Phone, Truck, CheckCircle2,
  AlertCircle, Camera, Check, Copy, ArrowRight, Upload, SwitchCamera, StopCircle, Zap
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useWorkerStore } from '../store/useWorkerStore'
import { useThemeStore } from '../store/useThemeStore'

export default function SearchPage() {
  const { parcels, updateParcelStatus, activeBranch } = useWorkerStore()
  const { isDark } = useThemeStore()
  const [query, setQuery] = useState('')
  const [selectedParcel, setSelectedParcel] = useState(null)
  
  // Camera & File Scanner states
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [scanMessage, setScanMessage] = useState(null)
  const [copiedId, setCopiedId] = useState(false)
  
  const html5QrCodeRef = useRef(null)

  // Handle successful QR/Barcode detection
  const handleScannedResult = (decodedText) => {
    const cleanText = decodedText.trim()
    setQuery(cleanText)

    const found = parcels.find(
      (p) =>
        p.tracking_number.toLowerCase() === cleanText.toLowerCase() ||
        (p.load_id && p.load_id.toLowerCase() === cleanText.toLowerCase()) ||
        p.shipment_ref.toLowerCase() === cleanText.toLowerCase() ||
        p.sender_phone.includes(cleanText) ||
        p.receiver_phone.includes(cleanText)
    )

    if (found) {
      setSelectedParcel(found)
      setScanMessage({ type: 'success', text: `✓ Scanned QR Code: ${found.tracking_number} matched!` })
    } else {
      setSelectedParcel(null)
      setScanMessage({ type: 'error', text: `Scanned code "${cleanText}" not found in registry.` })
    }
  }

  // Real Camera Scanner Effect using html5-qrcode
  useEffect(() => {
    let qrScanner = null

    if (isCameraActive) {
      setCameraError(null)
      qrScanner = new Html5Qrcode('camera-reader')
      html5QrCodeRef.current = qrScanner

      const config = { fps: 10, qrbox: { width: 220, height: 220 } }

      qrScanner
        .start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            handleScannedResult(decodedText)
            // Stop camera on successful scan
            stopCamera()
          },
          (errorMessage) => {
            // Ignore frame parse errors
          }
        )
        .catch((err) => {
          console.error('Camera Access Error:', err)
          setCameraError('Camera access denied or device has no camera available. You can use file upload or demo QR chips below.')
          setIsCameraActive(false)
        })
    }

    return () => {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(console.error)
        }
      }
    }
  }, [isCameraActive])

  const stopCamera = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.stop().then(() => {
        setIsCameraActive(false)
      }).catch(console.error)
    } else {
      setIsCameraActive(false)
    }
  }

  // Handle File Upload QR Scanning
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const qrScanner = new Html5Qrcode('file-reader-hidden')
    qrScanner
      .scanFile(file, true)
      .then((decodedText) => {
        handleScannedResult(decodedText)
      })
      .catch((err) => {
        setScanMessage({ type: 'error', text: 'Could not decode QR code from the uploaded image.' })
      })
  }

  // Manual Search Submit
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    const q = query.trim().toLowerCase()
    const found = parcels.find(
      (p) =>
        p.tracking_number.toLowerCase() === q ||
        (p.load_id && p.load_id.toLowerCase() === q) ||
        p.shipment_ref.toLowerCase() === q ||
        p.sender_phone.includes(q) ||
        p.receiver_phone.includes(q)
    )

    if (found) {
      setSelectedParcel(found)
      setScanMessage({ type: 'success', text: `Match found for ${found.tracking_number}` })
    } else {
      setSelectedParcel(null)
      setScanMessage({ type: 'error', text: `No parcel found matching "${query}"` })
    }
  }

  // Update Status Action
  const handleStatusChange = (newStatus) => {
    if (!selectedParcel) return
    updateParcelStatus(selectedParcel.tracking_number, newStatus, `Scanned & updated at ${activeBranch}`)
    setSelectedParcel((prev) => ({ ...prev, status: newStatus }))
    setScanMessage({
      type: 'success',
      text: `Status updated to ${newStatus.replace(/_/g, ' ').toUpperCase()} at ${activeBranch}`,
    })
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 1500)
  }

  // ─── THEME CONSTANTS ───
  const cardBase = isDark
    ? 'bg-[#111827] border-slate-800/60 shadow-none'
    : 'bg-white border-slate-200/80 shadow-xs'

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className={`space-y-6 max-w-5xl mx-auto font-sans ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
      
      {/* Hidden container for file decoding */}
      <div id="file-reader-hidden" className="hidden" />

      {/* ─── Page Header ─── */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl border ${cardBase}`}>
        <div>
          <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 ${textPrimary}`}>
            <ScanLine className="w-5 h-5 text-emerald-500" />
            Live QR & Barcode Scanner
          </h1>
          <p className={`text-xs font-medium ${textSecondary}`}>Scan QR code using camera, upload image file, or use manual entry.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${
            isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            Hub Location: <strong className="text-emerald-500">{activeBranch}</strong>
          </span>
        </div>
      </div>

      {/* ─── Scanner & Input Layout ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Real Live Camera Scanner Box (6 Cols) */}
        <div className={`md:col-span-6 p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${cardBase}`}>
          <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <h2 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${textPrimary}`}>
              <Camera className="w-4 h-4 text-emerald-500" />
              Camera QR Code Reader
            </h2>

            {isCameraActive ? (
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Camera Feed
              </span>
            ) : (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-100'
              }`}>
                Camera Idle
              </span>
            )}
          </div>

          {/* Camera Viewfinder Box */}
          <div className="relative bg-[#0a0f1a] rounded-xl overflow-hidden min-h-[240px] flex flex-col items-center justify-center text-center border border-slate-800/60">
            
            {/* Real HTML5 Camera Viewport */}
            <div id="camera-reader" className={`w-full h-full ${isCameraActive ? 'block' : 'hidden'}`} />

            {/* Idle State / Controls when camera is off */}
            {!isCameraActive && (
              <div className="p-6 space-y-3 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-emerald-500/70" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Press below to enable webcam or mobile camera</p>
                
                <button
                  onClick={() => setIsCameraActive(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 shadow-emerald-900/20"
                >
                  <Camera className="w-4 h-4" />
                  Start Live Camera Scanner
                </button>
              </div>
            )}

            {/* Stop Camera Button when active */}
            {isCameraActive && (
              <button
                onClick={stopCamera}
                className="absolute top-3 right-3 z-30 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1"
              >
                <StopCircle className="w-3.5 h-3.5" />
                Stop Camera
              </button>
            )}
          </div>

          {/* Error Message */}
          {cameraError && (
            <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-[11px] font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* File Upload Alternative Option */}
          <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <span className={`text-xs font-bold ${textSecondary}`}>Scan QR from Image File:</span>
            <label className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 ${
              isDark ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}>
              <Upload className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              Upload Image
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Demo QR Codes & Manual Form (6 Cols) */}
        <div className={`md:col-span-6 p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${cardBase}`}>
          <div>
            <h2 className={`text-xs font-extrabold uppercase tracking-wider border-b pb-3 mb-3 ${textPrimary} ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
              Scan Demo Parcels & Manual Input
            </h2>

            {/* Real QR Code Demo Cards */}
            <div className="space-y-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Point Camera at QR Codes below to test live scan:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {parcels.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleScannedResult(item.tracking_number)}
                    className={`p-2.5 border rounded-xl cursor-pointer transition-all text-center flex flex-col items-center space-y-1.5 group ${
                      isDark ? 'bg-slate-800/30 hover:bg-emerald-500/5 border-slate-700 hover:border-emerald-500/30' : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                      <QRCodeSVG value={item.tracking_number} size={64} />
                    </div>
                    <span className={`font-mono font-bold text-[10px] ${textPrimary}`}>{item.tracking_number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleSearchSubmit} className={`space-y-2.5 pt-2 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Or Search Manually:</span>
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Tracking #, Load ID, or Phone..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border ${
                    isDark ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-emerald-900/20"
                >
                  Lookup Code
                </button>
                <button
                  type="button"
                  onClick={() => { setQuery(''); setSelectedParcel(null); setScanMessage(null) }}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl ${
                    isDark ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Feedback Banner */}
          {scanMessage && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                scanMessage.type === 'success'
                  ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : scanMessage.type === 'error'
                  ? isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200'
                  : isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{scanMessage.text}</span>
            </div>
          )}
        </div>

      </div>

      {/* ─── Scanned Parcel Action Details Card ─── */}
      {selectedParcel && (
        <div className={`p-6 rounded-2xl border-2 shadow-md space-y-5 ${
          isDark ? 'bg-[#111827] border-emerald-500/30' : 'bg-white border-emerald-500/30'
        }`}>
          
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                <QRCodeSVG value={selectedParcel.tracking_number} size={48} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-black text-lg ${textPrimary}`}>{selectedParcel.tracking_number}</span>
                  <button
                    onClick={() => handleCopy(selectedParcel.tracking_number)}
                    className={`p-1 rounded ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'}`}
                    title="Copy Code"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className={`text-xs font-semibold ${textSecondary}`}>Ref: {selectedParcel.load_id || selectedParcel.shipment_ref}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase ${textSecondary}`}>Current Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {selectedParcel.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className={`p-4 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-800/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`flex items-center gap-1.5 font-extrabold uppercase text-[10px] ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                <User className="w-3.5 h-3.5" />
                Sender Info
              </div>
              <div className={`font-extrabold text-sm ${textPrimary}`}>{selectedParcel.sender_name}</div>
              <div className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <Phone className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                {selectedParcel.sender_phone}
              </div>
              <div className={`text-[11px] pt-1 border-t mt-1 ${isDark ? 'text-slate-400 border-slate-700/50' : 'text-slate-500 border-slate-200'}`}>
                {selectedParcel.sender_address}
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-800/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`flex items-center gap-1.5 font-extrabold uppercase text-[10px] ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                <MapPin className="w-3.5 h-3.5" />
                Receiver Info
              </div>
              <div className={`font-extrabold text-sm ${textPrimary}`}>{selectedParcel.receiver_name}</div>
              <div className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <Phone className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                {selectedParcel.receiver_phone}
              </div>
              <div className={`text-[11px] pt-1 border-t mt-1 ${isDark ? 'text-slate-400 border-slate-700/50' : 'text-slate-500 border-slate-200'}`}>
                {selectedParcel.receiver_address}
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-800/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`flex items-center gap-1.5 font-extrabold uppercase text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <Truck className="w-3.5 h-3.5" />
                Vehicle & Driver
              </div>
              <div className={`font-extrabold text-sm ${textPrimary}`}>{selectedParcel.driver_name}</div>
              <div className={isDark ? 'text-slate-300' : 'text-slate-600'}>{selectedParcel.vehicle_model}</div>
              <div className={`pt-1 border-t mt-1 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <span className={`font-mono font-black text-xs px-2 py-0.5 rounded border inline-block ${
                  isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>
                  Plate: {selectedParcel.vehicle_plate}
                </span>
              </div>
            </div>
          </div>

          {/* Dispatch Triggers */}
          <div className={`border-t pt-4 space-y-2 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Execute Dispatch Action:</span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStatusChange('ready_for_pickup')}
                className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-bold rounded-xl hover:bg-amber-500/20 transition-colors"
              >
                Mark Ready for Pickup
              </button>
              <button
                onClick={() => handleStatusChange('in_transit')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-900/20"
              >
                Dispatch Delivery Route
              </button>
              <button
                onClick={() => handleStatusChange('delivered')}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl hover:bg-emerald-500/20 transition-colors"
              >
                Mark Delivered
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
