import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, UserCheck, Package, Truck, Receipt, CheckCircle2, Copy, Printer, Info } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

export default function ShipParcelPage() {
  const navigate = useNavigate()
  
  // Form State
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    sender: { fullName: '', phone: '', email: '', address: '' },
    receiver: { fullName: '', phone: '', email: '', address: '' },
    parcel: { type: 'document', description: '', weight: '', estimatedValue: '', instructions: '' },
    options: { pickupBranch: '', deliveryMethod: 'home', deliverySpeed: 'standard' }
  })

  // Computed Costs
  const [costs, setCosts] = useState({ deliveryFee: 0, taxes: 0, total: 0 })

  // Mock References (generated on submit)
  const [references, setReferences] = useState({
    shipmentRef: '',
    trackingNum: '',
    createdOn: ''
  })

  // Handle Input Changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Calculate Costs dynamically
  useEffect(() => {
    let baseFee = 10.00 // base
    if (formData.options.deliveryMethod === 'home') baseFee += 2.00
    if (formData.options.deliverySpeed === 'express') baseFee += 5.00
    
    // Add minor fee based on weight if provided
    if (formData.parcel.weight && !isNaN(formData.parcel.weight)) {
      baseFee += (parseFloat(formData.parcel.weight) * 0.5)
    }

    const taxes = baseFee * 0.10 // 10% tax
    const total = baseFee + taxes

    setCosts({
      deliveryFee: baseFee,
      taxes: taxes,
      total: total
    })
  }, [formData.options, formData.parcel.weight])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Generate mock references
    const now = new Date()
    const dateString = now.toISOString().split('T')[0]
    setReferences({
      shipmentRef: `SPX-${dateString}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      trackingNum: `SPX${Math.floor(Math.random() * 10000000000)}`,
      createdOn: now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    })
    
    setIsSubmitted(true)
    toast.success('Shipment Created Successfully!')
    // Scroll to top on mobile to see the success message if needed, or let it stack.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrint = () => {
    window.print()
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setFormData({
      sender: { fullName: '', phone: '', email: '', address: '' },
      receiver: { fullName: '', phone: '', email: '', address: '' },
      parcel: { type: 'document', description: '', weight: '', estimatedValue: '', instructions: '' },
      options: { pickupBranch: '', deliveryMethod: 'home', deliverySpeed: 'standard' }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Helper component for Section Headers
  const SectionHeader = ({ icon: Icon, title, number }) => (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold">
        {number ? number : <Icon className="w-5 h-5" />}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  )

  // Helper component for Inputs
  const InputField = ({ label, type = 'text', required = false, value, onChange, placeholder, className = '' }) => (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type={type} 
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm disabled:opacity-50"
        disabled={isSubmitted}
      />
    </div>
  )

  return (
    <div className="py-8 pb-24 max-w-7xl mx-auto space-y-6">
      
      {/* Header (Hidden when printing) */}
      <div className="flex items-center gap-4 print:hidden px-4 sm:px-0">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 border border-border rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ship a Parcel</h1>
          <p className="text-muted-foreground text-sm">Fill in the details below to create your shipment.</p>
        </div>
      </div>

      <div className={`px-4 sm:px-0 ${!isSubmitted ? 'grid grid-cols-1 lg:grid-cols-3 gap-8 items-start' : 'max-w-2xl mx-auto'}`}>
        
        {/* Form View */}
        {!isSubmitted && (
          <form 
            onSubmit={handleSubmit} 
            className="lg:col-span-2 space-y-8 print:hidden"
          >
            {/* 1. Sender Details */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <SectionHeader icon={User} title="Sender Details" number="1" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Full Name" required value={formData.sender.fullName} onChange={e => handleInputChange('sender', 'fullName', e.target.value)} placeholder="Enter full name" />
                <InputField label="Phone Number" type="tel" required value={formData.sender.phone} onChange={e => handleInputChange('sender', 'phone', e.target.value)} placeholder="Enter phone number" />
                <InputField label="Email" type="email" required value={formData.sender.email} onChange={e => handleInputChange('sender', 'email', e.target.value)} placeholder="Enter email address" className="sm:col-span-2" />
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Address <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    value={formData.sender.address}
                    onChange={e => handleInputChange('sender', 'address', e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Receiver Details */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <SectionHeader icon={UserCheck} title="Receiver Details" number="2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Full Name" required value={formData.receiver.fullName} onChange={e => handleInputChange('receiver', 'fullName', e.target.value)} placeholder="Enter full name" />
                <InputField label="Phone Number" type="tel" required value={formData.receiver.phone} onChange={e => handleInputChange('receiver', 'phone', e.target.value)} placeholder="Enter phone number" />
                <InputField label="Email" type="email" required value={formData.receiver.email} onChange={e => handleInputChange('receiver', 'email', e.target.value)} placeholder="Enter email address" className="sm:col-span-2" />
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Address <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    value={formData.receiver.address}
                    onChange={e => handleInputChange('receiver', 'address', e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Parcel Details */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <SectionHeader icon={Package} title="Parcel Details" number="3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Parcel Type <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={formData.parcel.type}
                    onChange={e => handleInputChange('parcel', 'type', e.target.value)}
                    className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm appearance-none"
                  >
                    <option value="document">Document</option>
                    <option value="box">Box / Package</option>
                    <option value="fragile">Fragile Items</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
                <InputField label="Description" required value={formData.parcel.description} onChange={e => handleInputChange('parcel', 'description', e.target.value)} placeholder="Enter description of contents" />
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Weight <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      value={formData.parcel.weight}
                      onChange={e => handleInputChange('parcel', 'weight', e.target.value)}
                      placeholder="e.g. 2.5"
                      className="flex-1 px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                    />
                    <div className="px-4 py-2.5 bg-muted border border-border rounded-xl text-sm font-semibold text-muted-foreground flex items-center">
                      kg
                    </div>
                  </div>
                </div>

                <InputField label="Estimated Value" type="number" required value={formData.parcel.estimatedValue} onChange={e => handleInputChange('parcel', 'estimatedValue', e.target.value)} placeholder="Enter estimated value" />
                
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Special Instructions <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea 
                    value={formData.parcel.instructions}
                    onChange={e => handleInputChange('parcel', 'instructions', e.target.value)}
                    placeholder="Any special handling instructions"
                    rows={2}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Shipment Options */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <SectionHeader icon={Truck} title="Shipment Options" number="4" />
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Pickup Branch <span className="text-red-500">*</span></label>
                    <select 
                      required
                      value={formData.options.pickupBranch}
                      onChange={e => handleInputChange('options', 'pickupBranch', e.target.value)}
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm appearance-none"
                    >
                      <option value="" disabled>Select pickup branch</option>
                      <option value="accra-central">Accra Central Branch</option>
                      <option value="kumasi">Kumasi Main Hub</option>
                      <option value="takoradi">Takoradi Office</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Delivery Method <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      {['branch', 'home'].map((method) => (
                        <label key={method} className={`relative flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.options.deliveryMethod === method ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-muted/50'}`}>
                          <span className={`text-sm font-semibold capitalize flex-1 ${formData.options.deliveryMethod === method ? 'text-primary' : 'text-foreground'}`}>{method} Delivery</span>
                          <input 
                            type="radio" 
                            name="deliveryMethod" 
                            value={method}
                            checked={formData.options.deliveryMethod === method}
                            onChange={e => handleInputChange('options', 'deliveryMethod', e.target.value)}
                            className="w-4 h-4 text-primary accent-primary"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Delivery Speed <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'standard', name: 'Standard', desc: '3 - 5 business days' },
                      { id: 'express', name: 'Express', desc: '1 - 2 business days' }
                    ].map((speed) => (
                      <label 
                        key={speed.id} 
                        className={`relative flex items-center p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${formData.options.deliverySpeed === speed.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-muted/50'}`}
                      >
                        <input 
                          type="radio" 
                          name="deliverySpeed" 
                          value={speed.id}
                          checked={formData.options.deliverySpeed === speed.id}
                          onChange={e => handleInputChange('options', 'deliverySpeed', e.target.value)}
                          className="w-4 h-4 text-primary accent-primary shrink-0 mr-3"
                        />
                        <div>
                          <span className={`block text-sm font-bold ${formData.options.deliverySpeed === speed.id ? 'text-primary' : 'text-foreground'}`}>{speed.name}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5">{speed.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Cost Estimate */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <SectionHeader icon={Receipt} title="Cost Estimate" number="5" />
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>$ {costs.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                  <span>Taxes (10%)</span>
                  <span>$ {costs.taxes.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-center text-lg font-bold text-foreground tracking-tight">
                  <span>Total</span>
                  <span>$ {costs.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              Submit Shipment
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-2 h-2 text-emerald-500" /></span>
              Your information is secure and encrypted
            </div>
          </form>
        )}

        {/* Success View */}
        {isSubmitted && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-300 print:block">
            <div className="space-y-6">
              
              {/* Main Success Card */}
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  {/* Decorative dots */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <div className="absolute bottom-2 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Shipment Created Successfully!</h2>
                <p className="text-sm text-muted-foreground mb-8">Your shipment has been created. Please find your details below.</p>

                {/* Reference */}
                <div className="mb-8 max-w-sm mx-auto">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Shipment Reference</p>
                  <div className="py-3 px-4 bg-muted border border-border border-dashed rounded-xl font-mono font-bold text-foreground text-sm sm:text-base flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigator.clipboard.writeText(references.shipmentRef)}>
                    {references.shipmentRef}
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Keep this reference for your records.</p>
                </div>

                {/* QR Code */}
                <div className="mb-8 flex flex-col items-center justify-center">
                  <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-center">QR Code</p>
                  <div className="bg-white p-4 rounded-xl border border-border shadow-sm inline-flex justify-center items-center">
                    <QRCodeSVG value={references.trackingNum} size={160} level="H" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3 text-center">Scan to track your shipment</p>
                </div>

                {/* Tracking Number */}
                <div className="mb-6 max-w-sm mx-auto">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Tracking Number</p>
                  <div className="py-3 px-4 bg-muted border border-border border-dashed rounded-xl font-mono font-bold text-foreground text-lg tracking-wider flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigator.clipboard.writeText(references.trackingNum)}>
                    {references.trackingNum}
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Use this number to track your shipment online.</p>
                </div>
              </div>

              {/* Shipment Summary Card */}
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-bold text-foreground">Shipment Summary</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-semibold text-foreground text-right">{formData.sender.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-semibold text-foreground text-right">{formData.receiver.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Method</span>
                    <span className="font-semibold text-foreground text-right capitalize">{formData.options.deliveryMethod.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Speed</span>
                    <span className="font-semibold text-foreground text-right capitalize">{formData.options.deliverySpeed}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-foreground text-right">$ {costs.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created On</span>
                    <span className="font-medium text-foreground text-right">{references.createdOn}</span>
                  </div>
                </div>
              </div>

              {/* Actions (Hidden when printing) */}
              <div className="space-y-3 print:hidden max-w-sm mx-auto">
                <button 
                  onClick={handlePrint}
                  className="w-full py-3.5 bg-muted text-foreground rounded-xl font-bold text-sm hover:bg-accent transition-all ring-1 ring-border flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                <button 
                  onClick={resetForm}
                  className="w-full py-3.5 bg-card text-foreground rounded-xl font-bold text-sm hover:bg-accent transition-all ring-1 ring-border border border-transparent"
                >
                  Create Another Shipment
                </button>
              </div>

              <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-xl border border-border print:hidden max-w-sm mx-auto">
                <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A confirmation email has been sent to <span className="font-semibold text-foreground">{formData.sender.email || 'your email'}</span>
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}} />
    </div>
  )
}
