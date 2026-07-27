import { useState, useEffect, useRef } from 'react'
import { Map, MapMarker, MarkerContent, MapRoute } from '@/components/ui/map'
import { MapPin, Truck, Navigation } from 'lucide-react'

export function ParcelMap({ parcel }) {
  const mapRef = useRef(null)

  if (!parcel) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg text-center gap-3 p-8">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-slate-400">No parcel selected</p>
          <p className="text-[11px] text-slate-300 mt-0.5">Click on a shipment to view its route</p>
        </div>
      </div>
    )
  }

  const originLng = parcel.origin_coords?.lng ?? -96.7970
  const originLat = parcel.origin_coords?.lat ?? 32.7767
  const destLng = parcel.destination_coords?.lng ?? -87.6298
  const destLat = parcel.destination_coords?.lat ?? 41.8781

  const minLng = Math.min(originLng, destLng)
  const maxLng = Math.max(originLng, destLng)
  const minLat = Math.min(originLat, destLat)
  const maxLat = Math.max(originLat, destLat)

  const centerLng = (originLng + destLng) / 2
  const centerLat = (originLat + destLat) / 2

  useEffect(() => {
    if (mapRef.current) {
      try {
        mapRef.current.fitBounds(
          [
            [minLng - 1, minLat - 1],
            [maxLng + 1, maxLat + 1],
          ],
          { padding: 50, duration: 800 }
        )
      } catch (e) { /* noop */ }
    }
  }, [parcel?.id, minLng, maxLng, minLat, maxLat])

  const routeCoordinates = [
    [originLng, originLat],
    [centerLng, (originLat + destLat) / 2 + 0.3],
    [destLng, destLat],
  ]

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-100">

      <Map
        ref={mapRef}
        viewport={{ center: [centerLng, centerLat], zoom: 4.5 }}
        theme="light"
        className="w-full h-full"
      >
        <MapRoute
          id={`route-${parcel.id}`}
          coordinates={routeCoordinates}
          color="#4f46e5"
          width={4}
          opacity={0.85}
        />

        <MapMarker longitude={originLng} latitude={originLat}>
          <MarkerContent>
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-indigo-600 border-[2.5px] border-white flex items-center justify-center shadow-md" style={{ boxShadow: '0 2px 8px rgba(79,70,229,0.35)' }}>
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5 opacity-40" />
            </div>
          </MarkerContent>
        </MapMarker>

        <MapMarker longitude={destLng} latitude={destLat}>
          <MarkerContent>
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-600 border-[2.5px] border-white flex items-center justify-center shadow-md" style={{ boxShadow: '0 2px 8px rgba(5,150,105,0.35)' }}>
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5 opacity-40" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>

      {/* Floating route summary chip */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-lg px-2.5 py-1.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <span className="text-[11px] font-medium text-slate-600 max-w-[100px] truncate">{parcel.sender_address.split(',')[0]}</span>
        </div>
        <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 12 12"><path d="M2.5 6h7M7 3.5L9.5 6 7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-[11px] font-medium text-slate-600 max-w-[100px] truncate">{parcel.receiver_address.split(',')[0]}</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 ml-1">{parcel.distance}</span>
      </div>
    </div>
  )
}
