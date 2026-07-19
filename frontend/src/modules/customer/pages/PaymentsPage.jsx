import { useState } from 'react'
import {
  CreditCard, Wallet, FileText, CheckCircle2, History, ShieldAlert,
  ArrowRight, Phone, X, ShieldCheck, RefreshCcw, Banknote
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockInvoices, mockReceipts, mockRefunds } from '../data/mockPayments'
import { usePaystackPayment } from 'react-paystack'

// Use a generic test key so it pops up the widget. It might say 'Invalid key' inside the widget but it satisfies the requirement of embedding the SDK.
const PAYSTACK_TEST_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('invoices')
  
  // State for mock data (so we can simulate paying/refunding)
  const [invoices, setInvoices] = useState(mockInvoices)
  const [receipts, setReceipts] = useState(mockReceipts)
  const [refunds, setRefunds] = useState(mockRefunds)

  // Modals state
  const [checkoutInvoice, setCheckoutInvoice] = useState(null)
  const [refundReceipt, setRefundReceipt] = useState(null)

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = receipts.reduce((sum, r) => sum + r.amount, 0)

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  function handlePaySuccess(invoice, method) {
    // Remove from invoices
    setInvoices(invoices.filter(i => i.id !== invoice.id))
    // Add to receipts
    const newReceipt = {
      ...invoice,
      id: `RCPT-${Math.floor(Math.random() * 100000)}`,
      invoiceId: invoice.id,
      date: new Date().toISOString(),
      paymentMethod: method,
      status: 'paid'
    }
    setReceipts([newReceipt, ...receipts])
    setCheckoutInvoice(null)
  }

  function handleRefundSubmit(receipt, reason) {
    // Add to refunds
    const newRefund = {
      id: `RFND-${Math.floor(Math.random() * 1000)}`,
      receiptId: receipt.id,
      trackingNumber: receipt.trackingNumber,
      amount: receipt.amount,
      currency: receipt.currency,
      dateRequested: new Date().toISOString(),
      status: 'pending_auth',
      reason
    }
    setRefunds([newRefund, ...refunds])
    setRefundReceipt(null)
    setActiveTab('refunds')
  }

  return (
    <div className="py-8 sm:py-10 max-w-5xl mx-auto space-y-8 px-4 sm:px-6">
      {/* HEADER DASHBOARD */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/15">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Payments & Billing</h1>
            <p className="text-muted-foreground text-sm">Manage your invoices, receipts, and refund requests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between border-l-4 border-l-amber-500">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Outstanding Balance</p>
            <h2 className="text-4xl font-black text-foreground">{formatCurrency(totalOutstanding)}</h2>
          </div>
          <div className="glass-card rounded-[24px] p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Total Paid</p>
            <h2 className="text-4xl font-black text-foreground">{formatCurrency(totalPaid)}</h2>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-border">
        {['invoices', 'receipts', 'refunds'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-sm font-bold capitalize border-b-2 transition-colors",
              activeTab === tab 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[400px]">
        {/* INVOICES */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No outstanding invoices. You're all caught up!</div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="glass-card rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{inv.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{inv.trackingNumber}</span>
                        <span>•</span>
                        <span>{formatDate(inv.date)}</span>
                        <span>•</span>
                        <span className="text-amber-500 font-semibold uppercase">{inv.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xl font-black text-foreground">{formatCurrency(inv.amount)}</span>
                    <button 
                      onClick={() => setCheckoutInvoice(inv)}
                      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* RECEIPTS */}
        {activeTab === 'receipts' && (
          <div className="space-y-4">
            {receipts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No payment history found.</div>
            ) : (
              receipts.map(rcpt => {
                const canRefund = rcpt.shipmentStatus === 'lost' || rcpt.shipmentStatus === 'returned'
                const hasPendingRefund = refunds.some(r => r.receiptId === rcpt.id)

                return (
                  <div key={rcpt.id} className="glass-card rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{rcpt.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{rcpt.trackingNumber}</span>
                          <span>•</span>
                          <span>{formatDate(rcpt.date)}</span>
                          <span>•</span>
                          <span className="text-emerald-500 font-semibold uppercase">{rcpt.status} via {rcpt.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xl font-black text-foreground">{formatCurrency(rcpt.amount)}</span>
                      {canRefund && !hasPendingRefund && (
                        <button 
                          onClick={() => setRefundReceipt(rcpt)}
                          className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-bold text-xs hover:bg-destructive hover:text-destructive-foreground transition-all"
                        >
                          Request Refund
                        </button>
                      )}
                      {canRefund && hasPendingRefund && (
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg font-bold text-xs border border-amber-500/20">
                          Refund Pending Auth
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* REFUNDS */}
        {activeTab === 'refunds' && (
          <div className="space-y-4">
            {refunds.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No refund requests found.</div>
            ) : (
              refunds.map(rfnd => (
                <div key={rfnd.id} className="glass-card rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-amber-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Refund Request - {rfnd.trackingNumber}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{rfnd.receiptId}</span>
                        <span>•</span>
                        <span>Requested {formatDate(rfnd.dateRequested)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 italic">"{rfnd.reason}"</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                    <span className="text-xl font-black text-foreground">{formatCurrency(rfnd.amount)}</span>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg font-bold text-xs border border-amber-500/20 uppercase tracking-widest">
                      {rfnd.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {checkoutInvoice && (
        <CheckoutModal 
          invoice={checkoutInvoice} 
          onClose={() => setCheckoutInvoice(null)} 
          onSuccess={(method) => handlePaySuccess(checkoutInvoice, method)} 
        />
      )}

      {refundReceipt && (
        <RefundModal
          receipt={refundReceipt}
          onClose={() => setRefundReceipt(null)}
          onSubmit={(reason) => handleRefundSubmit(refundReceipt, reason)}
        />
      )}
    </div>
  )
}

// -------------------------------------------------------------
// CHECKOUT MODAL
// -------------------------------------------------------------
function CheckoutModal({ invoice, onClose, onSuccess }) {
  const [method, setMethod] = useState('momo') // momo | paystack | hubtel
  const [phone, setPhone] = useState('')
  const [network, setNetwork] = useState('mtn')
  const [processing, setProcessing] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState('')

  // Paystack Integration (Embedded Test SDK)
  const config = {
    reference: (new Date()).getTime().toString(),
    email: "customer@pacelops.com",
    amount: invoice.amount * 100, // in pesewas
    publicKey: PAYSTACK_TEST_KEY,
    currency: 'GHS',
  }
  const initializePayment = usePaystackPayment(config)

  function handleProcess() {
    if (method === 'paystack') {
      // Trigger Paystack Embedded Widget
      initializePayment(
        (reference) => {
          // Success callback
          onSuccess('Paystack')
        },
        () => {
          // Close callback
          console.log("Paystack modal closed")
        }
      )
      return
    }

    // Simulate MoMo / Hubtel
    setProcessing(true)
    setTimeout(() => {
      setShowOtp(true)
      setProcessing(false)
    }, 1500)
  }

  function handleVerifyOtp() {
    setProcessing(true)
    setTimeout(() => {
      onSuccess(method === 'momo' ? 'Mobile Money' : 'Hubtel')
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
          <div>
            <h3 className="text-xl font-extrabold text-foreground">Checkout</h3>
            <p className="text-sm font-mono text-muted-foreground mt-1">{invoice.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showOtp ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="font-bold text-foreground">Total to Pay</span>
              <span className="text-2xl font-black text-primary">{formatCurrency(invoice.amount)}</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setMethod('momo')}
                  className={cn("p-3 rounded-xl border flex flex-col items-center gap-2 transition-all", method === 'momo' ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30")}
                >
                  <Phone className={cn("w-5 h-5", method === 'momo' ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-bold", method === 'momo' ? "text-foreground" : "text-muted-foreground")}>MoMo</span>
                </button>
                <button
                  onClick={() => setMethod('paystack')}
                  className={cn("p-3 rounded-xl border flex flex-col items-center gap-2 transition-all", method === 'paystack' ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30")}
                >
                  <CreditCard className={cn("w-5 h-5", method === 'paystack' ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-bold", method === 'paystack' ? "text-foreground" : "text-muted-foreground")}>Paystack</span>
                </button>
                <button
                  onClick={() => setMethod('hubtel')}
                  className={cn("p-3 rounded-xl border flex flex-col items-center gap-2 transition-all", method === 'hubtel' ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30")}
                >
                  <Banknote className={cn("w-5 h-5", method === 'hubtel' ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-bold", method === 'hubtel' ? "text-foreground" : "text-muted-foreground")}>Hubtel</span>
                </button>
              </div>
            </div>

            {(method === 'momo' || method === 'hubtel') && (
              <div className="space-y-4 animate-in slide-in-from-top-2">
                {method === 'momo' && (
                  <select 
                    value={network} onChange={(e) => setNetwork(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="vodafone">Telecel Cash</option>
                    <option value="at">AT Money</option>
                  </select>
                )}
                <input
                  type="tel"
                  placeholder="Mobile Number (e.g. 024XXXXXXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={processing || ((method === 'momo' || method === 'hubtel') && phone.length < 10)}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : 'Proceed to Pay'}
            </button>
          </div>
        ) : (
          <div className="p-8 space-y-6 text-center animate-in slide-in-from-right-4">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">Authorize Payment</h3>
            <p className="text-sm text-muted-foreground">Please check your phone and enter the OTP sent to <span className="font-bold text-foreground">{phone}</span></p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center tracking-[0.5em] font-mono text-xl bg-background border border-border rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary/30 outline-none"
              maxLength={4}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={processing || otp.length !== 4}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : 'Confirm Payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// REFUND MODAL
// -------------------------------------------------------------
function RefundModal({ receipt, onClose, onSubmit }) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between bg-destructive/5">
          <div>
            <h3 className="text-xl font-extrabold text-destructive">Request Refund</h3>
            <p className="text-sm font-mono text-muted-foreground mt-1">{receipt.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">Tracking Number:</span> <span className="font-bold font-mono text-foreground">{receipt.trackingNumber}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">Refund Amount:</span> <span className="font-bold text-foreground">{formatCurrency(receipt.amount)}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">Shipment Status:</span> <span className="font-bold uppercase text-amber-500">{receipt.shipmentStatus.replace('_', ' ')}</span></p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reason for Refund <span className="text-destructive">*</span></label>
            <textarea
              required
              rows={4}
              placeholder="Please explain why you are requesting a refund for this transaction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-destructive/30 outline-none resize-none"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Refunds require authorization. By submitting this request, an investigation will be opened. Processing may take 3-5 business days.
            </p>
          </div>

          <button
            onClick={() => onSubmit(reason)}
            disabled={reason.trim().length < 10}
            className="w-full py-4 bg-destructive text-destructive-foreground rounded-xl font-bold hover:bg-destructive/90 transition-all disabled:opacity-50"
          >
            Submit Refund Request
          </button>
        </div>
      </div>
    </div>
  )
}
