import { useNavigate } from 'react-router-dom'
import { useWorkerStore } from '../store/useWorkerStore'
import { useThemeStore } from '../store/useThemeStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

const shipmentSchema = z.object({
  sender_name: z.string().min(2, 'Sender name is required'),
  sender_phone: z.string().min(5, 'Valid phone number required'),
  receiver_name: z.string().min(2, 'Receiver name is required'),
  receiver_phone: z.string().min(5, 'Valid phone number required'),
  parcel_type: z.enum(['Electronics', 'Documents', 'Fashion']),
  weight: z.string().min(1, 'Weight is required'),
  delivery_method: z.enum(['Branch Pickup', 'Doorstep Delivery']),
})

export default function CreateShipmentPage() {
  const navigate = useNavigate()
  const { addShipment, activeBranch } = useWorkerStore()
  const { isDark } = useThemeStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      sender_name: '',
      sender_phone: '',
      receiver_name: '',
      receiver_phone: '',
      parcel_type: 'Electronics',
      weight: '1.0kg',
      delivery_method: 'Branch Pickup',
    }
  })

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const created = addShipment({
      ...data,
      pickup_branch: activeBranch,
    })

    alert(`Shipment Created!\nTracking #: ${created.tracking_number}`)
    navigate('/worker/dashboard')
  }

  const cardBase = isDark
    ? 'bg-[#111827] border-slate-800/60'
    : 'bg-white border-slate-200'

  const inputClass = isDark
    ? '!bg-slate-800/50 !border-slate-700 !text-white placeholder:!text-slate-500 focus-visible:!ring-emerald-500/30'
    : ''

  const selectClass = `flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
    isDark
      ? 'bg-slate-800/50 border-slate-700 text-white focus-visible:ring-emerald-500/30 ring-offset-slate-900'
      : 'bg-white border-slate-200 text-slate-900 focus-visible:ring-slate-950 ring-offset-white'
  }`

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-10">
      <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create Walk-in Shipment</h1>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-muted-foreground'}`}>Register parcel intake for walk-in customer</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={`border p-6 rounded-2xl space-y-6 ${cardBase}`}>

        {/* Sender */}
        <div className="space-y-3">
          <h3 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Sender Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sender_name" className={isDark ? 'text-slate-300' : ''}>Full Name</Label>
              <Input id="sender_name" {...register('sender_name')} placeholder="Sender Name" className={inputClass} />
              {errors.sender_name && <p className="text-xs text-red-400">{errors.sender_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sender_phone" className={isDark ? 'text-slate-300' : ''}>Phone Number</Label>
              <Input id="sender_phone" {...register('sender_phone')} placeholder="e.g. +233 50 123 4567" className={inputClass} />
              {errors.sender_phone && <p className="text-xs text-red-400">{errors.sender_phone.message}</p>}
            </div>
          </div>
        </div>

        {/* Receiver */}
        <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <h3 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Receiver Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="receiver_name" className={isDark ? 'text-slate-300' : ''}>Full Name</Label>
              <Input id="receiver_name" {...register('receiver_name')} placeholder="Receiver Name" className={inputClass} />
              {errors.receiver_name && <p className="text-xs text-red-400">{errors.receiver_name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="receiver_phone" className={isDark ? 'text-slate-300' : ''}>Phone Number</Label>
              <Input id="receiver_phone" {...register('receiver_phone')} placeholder="e.g. +233 24 987 6543" className={inputClass} />
              {errors.receiver_phone && <p className="text-xs text-red-400">{errors.receiver_phone.message}</p>}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <h3 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Parcel Specification</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="parcel_type" className={isDark ? 'text-slate-300' : ''}>Type</Label>
              <select id="parcel_type" {...register('parcel_type')} className={selectClass}>
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents</option>
                <option value="Fashion">Fashion</option>
              </select>
              {errors.parcel_type && <p className="text-xs text-red-400">{errors.parcel_type.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weight" className={isDark ? 'text-slate-300' : ''}>Weight (kg)</Label>
              <Input id="weight" {...register('weight')} placeholder="1.0kg" className={inputClass} />
              {errors.weight && <p className="text-xs text-red-400">{errors.weight.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delivery_method" className={isDark ? 'text-slate-300' : ''}>Delivery Method</Label>
              <select id="delivery_method" {...register('delivery_method')} className={selectClass}>
                <option value="Branch Pickup">Branch Pickup</option>
                <option value="Doorstep Delivery">Doorstep Delivery</option>
              </select>
              {errors.delivery_method && <p className="text-xs text-red-400">{errors.delivery_method.message}</p>}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl mt-4 cursor-pointer"
        >
          {isSubmitting ? "Processing..." : "Submit Shipment"}
        </Button>
      </form>
    </div>
  )
}
