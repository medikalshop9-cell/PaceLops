import { WorkerLayout } from './components/WorkerLayout'
import DashboardPage from './pages/DashboardPage'
import AllParcelsPage from './pages/AllParcelsPage'
import SearchPage from './pages/SearchPage'
import ScanLogsPage from './pages/ScanLogsPage'
import CreateShipmentPage from './pages/CreateShipmentPage'

export const workerRoutes = [
  {
    path: '/worker',
    element: <WorkerLayout />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'parcels',
        element: <AllParcelsPage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'scan-logs',
        element: <ScanLogsPage />,
      },
      {
        path: 'create-shipment',
        element: <CreateShipmentPage />,
      },
    ],
  },
]
