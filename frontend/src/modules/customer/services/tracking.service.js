import { mockParcels } from '../data/mockParcels'

/**
 * Track a parcel by tracking number.
 * Frontend-only mock — swap this body for a real API call when the backend endpoint is ready:
 *   const res = await axios.get(`/api/tracking/${trackingNumber}`)
 *   return res.data
 */
export async function trackParcel(trackingNumber) {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 900))

  const found = mockParcels.find(
    p => p.trackingNumber.toLowerCase() === trackingNumber.trim().toLowerCase()
  )

  if (!found) {
    const err = new Error('Parcel not found')
    err.code = 'NOT_FOUND'
    throw err
  }

  return found
}
