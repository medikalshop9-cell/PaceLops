import { CustomerLayout } from './layouts/CustomerLayout'
import CustomerDashboard from './pages/CustomerDashboard'
import ShipParcelPage from './pages/ShipParcelPage'

export const customerRoutes = [
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerDashboard />,
      },
      {
        path: 'dashboard',
        element: <CustomerDashboard />,
      },
      // Placeholders for other routes mentioned in the navigation
      {
        path: 'track',
        element: <div className="p-6">Track Parcel Page Placeholder</div>,
      },
      {
        path: 'new-shipment',
        element: <ShipParcelPage />,
      },
      {
        path: 'pickup-slots',
        element: <div className="p-6">Pickup Slots Page Placeholder</div>,
      },
      {
        path: 'payment',
        element: <div className="p-6">Payment Page Placeholder</div>,
      },
      {
        path: 'history',
        element: <div className="p-6">History Page Placeholder</div>,
      },
    ],
  },
]
