import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkerStore } from '../store/useWorkerStore'

export default function CreateShipmentPage() {
  const navigate = useNavigate()
  const { addShipment, activeBranch } = useWorkerStore()

  const [formData, setFormData] = useState({
    sender_name: '',
    sender_phone: '',
    sender_address: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    parcel_type: 'Electronics',
    weight: '1.0kg',
    delivery_method: 'Branch Pickup',
    delivery_speed: 'Express',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const created = addShipment({
      ...formData,
      pickup_branch: activeBranch,
    })

    alert(`Shipment Created!\nTracking #: ${created.tracking_number}`)
    navigate('/worker/dashboard')
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-bold">Create Walk-in Shipment</h1>
          <p className="text-sm text-muted-foreground">Register parcel intake for walk-in customer</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border border-border text-xs rounded"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="border border-border p-4 rounded space-y-4 text-sm">
        <div className="space-y-2">
          <div className="font-bold text-xs uppercase text-muted-foreground">Sender Information</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="sender_name"
              required
              value={formData.sender_name}
              onChange={handleChange}
              placeholder="Sender Name"
              className="px-3 py-1.5 border border-border rounded bg-transparent"
            />
            <input
              type="text"
              name="sender_phone"
              required
              value={formData.sender_phone}
              onChange={handleChange}
              placeholder="Sender Phone"
              className="px-3 py-1.5 border border-border rounded bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <div className="font-bold text-xs uppercase text-muted-foreground">Receiver Information</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="receiver_name"
              required
              value={formData.receiver_name}
              onChange={handleChange}
              placeholder="Receiver Name"
              className="px-3 py-1.5 border border-border rounded bg-transparent"
            />
            <input
              type="text"
              name="receiver_phone"
              required
              value={formData.receiver_phone}
              onChange={handleChange}
              placeholder="Receiver Phone"
              className="px-3 py-1.5 border border-border rounded bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <div className="font-bold text-xs uppercase text-muted-foreground">Parcel Specification</div>
          <div className="grid grid-cols-3 gap-2">
            <select
              name="parcel_type"
              value={formData.parcel_type}
              onChange={handleChange}
              className="px-2 py-1.5 border border-border rounded bg-transparent text-xs"
            >
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents</option>
              <option value="Fashion">Fashion</option>
            </select>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight"
              className="px-3 py-1.5 border border-border rounded bg-transparent"
            />
            <select
              name="delivery_method"
              value={formData.delivery_method}
              onChange={handleChange}
              className="px-2 py-1.5 border border-border rounded bg-transparent text-xs"
            >
              <option value="Branch Pickup">Branch Pickup</option>
              <option value="Doorstep Delivery">Doorstep Delivery</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 border border-border font-bold rounded text-sm mt-4"
        >
          Submit Shipment
        </button>
      </form>
    </div>
  )
}
