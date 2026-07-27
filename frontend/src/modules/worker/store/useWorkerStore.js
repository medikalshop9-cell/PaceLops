import { create } from 'zustand'

const initialParcels = [
  {
    id: 'spx-001',
    shipment_ref: 'SPX-2026-001',
    tracking_number: 'TRK-9812401',
    load_id: '#1246677',
    sender_name: 'Kwame Mensah',
    sender_phone: '+233 24 123 4567',
    sender_email: 'kwame@example.com',
    sender_address: '2450 Logistics Dr, Dallas, TX 75241, USA',
    receiver_name: 'Abena Osei',
    receiver_phone: '+233 20 987 6543',
    receiver_email: 'abena@example.com',
    receiver_address: '7200 Pulaski, Chicago, IL 60629, USA',
    pickup_date: 'March 12, 2026',
    delivery_date: 'March 14, 2026',
    distance: '980 mi',
    price: '$1920',
    price_rate: '$0.73/mi',
    vehicle_model: 'Isuzu NPR HD Cargo Truck',
    vehicle_plate: 'GT-4921-24',
    driver_name: 'Midwest Auto Transport LLC',
    driver_phone: '+1 (312) 555-7814',
    parcel_type: 'Electronics',
    description: 'Laptop & accessories',
    weight: '2.5kg',
    estimated_value: '$1920.00',
    pickup_branch: 'Dallas Logistics Hub',
    delivery_method: 'Doorstep Delivery',
    delivery_speed: 'Express',
    status: 'in_transit',
    created_at: new Date().toISOString(),
    origin_coords: { lat: 32.7767, lng: -96.7970 },
    destination_coords: { lat: 41.8781, lng: -87.6298 }
  },
  {
    id: 'spx-002',
    shipment_ref: 'SPX-2026-002',
    tracking_number: 'TRK-9812402',
    load_id: '#1246678',
    sender_name: 'Sarah Jenkins',
    sender_phone: '+233 55 444 3322',
    sender_email: 'sarah@example.com',
    sender_address: 'Airport Residential, Accra, Ghana',
    receiver_name: 'Kofi Annan',
    receiver_phone: '+233 27 111 2233',
    receiver_email: 'kofi@example.com',
    receiver_address: 'Takoradi Market Circle, Takoradi, Ghana',
    pickup_date: 'March 15, 2026',
    delivery_date: 'March 16, 2026',
    distance: '240 km',
    price: '$450',
    price_rate: '$1.87/km',
    vehicle_model: 'Toyota HiAce Cargo Van',
    vehicle_plate: 'GW-8812-23',
    driver_name: 'Express Logistics GH',
    driver_phone: '+233 24 999 1122',
    parcel_type: 'Documents',
    description: 'Legal contracts',
    weight: '0.4kg',
    estimated_value: '$200.00',
    pickup_branch: 'Accra Main Hub',
    delivery_method: 'Branch Pickup',
    delivery_speed: 'Standard',
    status: 'ready_for_pickup',
    created_at: new Date().toISOString(),
    origin_coords: { lat: 5.6037, lng: -0.1870 },
    destination_coords: { lat: 4.8984, lng: -1.7587 }
  },
  {
    id: 'spx-003',
    shipment_ref: 'SPX-2026-003',
    tracking_number: 'TRK-9812403',
    load_id: '#1246679',
    sender_name: 'David Mills',
    sender_phone: '+233 24 999 8877',
    sender_email: 'david@example.com',
    sender_address: 'Spintex Road, Accra, Ghana',
    receiver_name: 'Grace Addo',
    receiver_phone: '+233 50 333 2211',
    receiver_email: 'grace@example.com',
    receiver_address: 'Adum Central, Kumasi, Ghana',
    pickup_date: 'March 18, 2026',
    delivery_date: 'March 19, 2026',
    distance: '270 km',
    price: '$620',
    price_rate: '$2.30/km',
    vehicle_model: 'Hyundai Mighty HD72 Truck',
    vehicle_plate: 'AS-3341-22',
    driver_name: 'Intercity Transporters',
    driver_phone: '+233 20 777 4455',
    parcel_type: 'Fashion',
    description: 'African Print Clothing',
    weight: '1.2kg',
    estimated_value: '$800.00',
    pickup_branch: 'Kumasi Hub',
    delivery_method: 'Doorstep Delivery',
    delivery_speed: 'Express',
    status: 'pending',
    created_at: new Date().toISOString(),
    origin_coords: { lat: 5.6322, lng: -0.1293 },
    destination_coords: { lat: 6.6885, lng: -1.6244 }
  }
]

const initialLogs = [
  {
    id: 'log-101',
    tracking_number: 'TRK-9812401',
    action_type: 'Marked Ready for Pickup',
    branch: 'Accra Main Hub',
    worker_name: 'Worker Alex',
    scanned_at: new Date(Date.now() - 3600000).toISOString(),
    notes: 'Package stored in Locker B4'
  },
  {
    id: 'log-102',
    tracking_number: 'TRK-9812403',
    action_type: 'Hub Intake Check-in',
    branch: 'Accra Main Hub',
    worker_name: 'Worker Alex',
    scanned_at: new Date(Date.now() - 7200000).toISOString(),
    notes: 'Dispatched to Tema truck'
  }
]

export const useWorkerStore = create((set, get) => ({
  parcels: initialParcels,
  scanLogs: initialLogs,
  activeBranch: 'Accra Main Hub',

  setActiveBranch: (branch) => set({ activeBranch: branch }),

  addShipment: (newShipment) => {
    const shipment = {
      id: `spx-${Date.now()}`,
      shipment_ref: `SPX-${Date.now()}`,
      tracking_number: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      load_id: `#${Math.floor(1000000 + Math.random() * 9000000)}`,
      pickup_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      delivery_date: 'Pending Schedule',
      distance: '150 km',
      price: '$350',
      price_rate: '$2.33/km',
      vehicle_model: 'Isuzu NPR HD Cargo',
      vehicle_plate: 'GT-4921-24',
      driver_name: 'Local Branch Transporter',
      driver_phone: '+233 24 000 1122',
      status: 'pending',
      created_at: new Date().toISOString(),
      origin_coords: { lat: 5.6037, lng: -0.1870 },
      destination_coords: { lat: 6.6885, lng: -1.6244 },
      ...newShipment,
    }

    set((state) => ({
      parcels: [shipment, ...state.parcels],
      scanLogs: [
        {
          id: `log-${Date.now()}`,
          tracking_number: shipment.tracking_number,
          action_type: 'Initial Parcel Intake',
          branch: state.activeBranch,
          worker_name: 'Worker Alex',
          scanned_at: new Date().toISOString(),
          notes: 'Shipment registered at counter'
        },
        ...state.scanLogs
      ]
    }))

    return shipment
  },

  updateParcelStatus: (trackingNumber, newStatus, notes = '') => {
    set((state) => {
      const updatedParcels = state.parcels.map((p) =>
        p.tracking_number === trackingNumber || p.shipment_ref === trackingNumber || p.id === trackingNumber
          ? { ...p, status: newStatus }
          : p
      )

      const newLog = {
        id: `log-${Date.now()}`,
        tracking_number: trackingNumber,
        action_type: `Status updated to ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
        branch: state.activeBranch,
        worker_name: 'Worker Alex',
        scanned_at: new Date().toISOString(),
        notes: notes || 'Status updated via Worker Dashboard'
      }

      return {
        parcels: updatedParcels,
        scanLogs: [newLog, ...state.scanLogs]
      }
    })
  },

  getStats: () => {
    const { parcels } = get()
    const today = new Date().toISOString().split('T')[0]

    const dailyIntake = parcels.filter((p) =>
      p.created_at.startsWith(today) || p.created_at
    ).length

    const pendingPickups = parcels.filter(
      (p) => p.status === 'ready_for_pickup' || p.delivery_method === 'Branch Pickup'
    ).length

    const deliveryRequests = parcels.filter(
      (p) => p.status === 'pending' || p.delivery_method === 'Doorstep Delivery'
    ).length

    return { dailyIntake, pendingPickups, deliveryRequests }
  }
}))
