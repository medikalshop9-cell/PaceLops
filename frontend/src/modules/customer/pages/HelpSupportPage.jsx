import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HelpCircle, AlertTriangle, Send, CheckCircle2,
  Package, FileText, Phone, User, Hash, ArrowLeft, UploadCloud
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HelpSupportPage() {
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [formData, setFormData] = useState({
    issueType: '',
    trackingNumber: '',
    recipientName: '',
    phoneNumber: '',
    description: '',
    receipt: null
  })

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, receipt: e.target.files[0] })
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    // Mock API call
    setTimeout(() => {
      setStatus('success')
    }, 1500)
  }

  if (status === 'success') {
    return (
      <div className="py-12 sm:py-20 flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 animate-scale-up">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-4">Ticket Submitted!</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          We've received your report for tracking number <span className="font-mono text-foreground font-bold">{formData.trackingNumber}</span>. 
          Our support team will investigate and get back to you shortly via the provided phone number.
        </p>
        <Link 
          to="/customer/track"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
        >
          Return to Tracking
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-10 max-w-2xl mx-auto space-y-8 px-4 sm:px-0">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Help & Support</h1>
        </div>
        <p className="text-muted-foreground text-sm pl-13">
          Report an issue with a lost or returned parcel.
        </p>
      </div>

      <div className="glass-card rounded-[24px] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Issue Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Issue Type <span className="text-destructive">*</span>
            </label>
            <select
              required
              value={formData.issueType}
              onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none appearance-none"
            >
              <option value="" disabled>Select the issue...</option>
              <option value="lost">Parcel Reported Lost</option>
              <option value="returned">Parcel Returned to Sender</option>
              <option value="other">Other Issue</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tracking Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Hash className="w-3.5 h-3.5" />
                Tracking Number <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TRK123456789"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none font-mono"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0241234567"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none"
              />
            </div>
          </div>

          {/* Recipient Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Recipient Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Full name of the recipient"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none"
            />
          </div>

          {/* Upload Receipt */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Upload Print Receipt <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                required
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="receipt-upload"
              />
              <label 
                htmlFor="receipt-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors bg-background"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
                </div>
              </label>
              {formData.receipt && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate">{formData.receipt.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              Additional Details
            </label>
            <textarea
              rows={4}
              placeholder="Please provide any additional context..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {status === 'submitting' ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
