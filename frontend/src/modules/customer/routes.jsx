import { CustomerLayout } from './layouts/CustomerLayout'
import CustomerDashboard from './pages/CustomerDashboard'
import ShipParcelPage from './pages/ShipParcelPage'
import MyParcelsPage from './pages/MyParcelsPage'
import PickupSchedulingPage from './pages/PickupSchedulingPage'
import TrackParcelPage from './pages/TrackParcelPage'
import DeliveryRequestsPage from './pages/DeliveryRequestsPage'
import ProfilePage from './pages/ProfilePage'
import HelpSupportPage from './pages/HelpSupportPage'

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
      {
        path: 'delivery-requests',
        element: <DeliveryRequestsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'support',
        element: <HelpSupportPage />,
      },
      {
        path: 'track',
        element: <TrackParcelPage />,
      },
      {
        path: 'new-shipment',
        element: <ShipParcelPage />,
      },
      {
        path: 'pickup-slots',
        element: <PickupSchedulingPage />,
      },
      {
        path: 'payment',
        element: <div className="p-6">Payment Page Placeholder</div>,
      },
      {
        path: 'my-parcels',
        element: <MyParcelsPage />,
      },
    ],
  },
]
