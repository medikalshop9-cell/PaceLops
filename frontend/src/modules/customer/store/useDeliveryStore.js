import { create } from 'zustand'

export const useDeliveryStore = create((set, get) => ({
  // Parcels currently at the hub that are ready for home delivery
  readyParcels: [
    {
      id: 'P-100234',
      trackingNumber: 'TRK9928374102',
      weight: '2.4 kg',
      origin: 'Lagos Hub',
      arrivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      description: 'Electronics package',
    },
    {
      id: 'P-100235',
      trackingNumber: 'TRK4481923091',
      weight: '0.8 kg',
      origin: 'Abuja Hub',
      arrivedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      description: 'Document folder',
    },
  ],

  // Removed hardcoded savedAddresses as they are now managed in useProfileStore

  // Deliveries that have been requested and are in progress
  activeRequests: [
    {
      id: 'DEL-101',
      parcelId: 'P-100100',
      trackingNumber: 'TRK1122334455',
      address: '123 Main St, Springfield, IL 62701',
      instructions: 'Leave at front door',
      status: 'Scheduled',
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    }
  ],

  requestDelivery: (parcelId, addressString, instructions = '') => {
    set((state) => {
      const parcelIndex = state.readyParcels.findIndex(p => p.id === parcelId)
      if (parcelIndex === -1) return state

      const parcel = state.readyParcels[parcelIndex]

      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase()
      const newRequest = {
        id: `DEL-${randomId}`,
        parcelId: parcel.id,
        trackingNumber: parcel.trackingNumber,
        address: addressString,
        instructions,
        status: 'Requested',
        requestedAt: new Date().toISOString(),
      }

      // Remove from ready, add to active
      const updatedReady = [...state.readyParcels]
      updatedReady.splice(parcelIndex, 1)

      return {
        readyParcels: updatedReady,
        activeRequests: [newRequest, ...state.activeRequests]
      }
    })
  },

  cancelDeliveryRequest: (requestId) => {
    // For demo purposes, we'd allow canceling if it's just 'Requested'
    // Moving it back to readyParcels
    set((state) => {
      const reqIndex = state.activeRequests.findIndex(r => r.id === requestId)
      if (reqIndex === -1) return state

      const request = state.activeRequests[reqIndex]
      
      const revertedParcel = {
        id: request.parcelId,
        trackingNumber: request.trackingNumber,
        weight: 'Unknown (Mock Revert)',
        origin: 'Returned to Queue',
        arrivedAt: new Date().toISOString(),
        description: 'Reverted package',
      }

      const updatedActive = [...state.activeRequests]
      updatedActive.splice(reqIndex, 1)

      return {
        activeRequests: updatedActive,
        readyParcels: [revertedParcel, ...state.readyParcels]
      }
    })
  }
}))
