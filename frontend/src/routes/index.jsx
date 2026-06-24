import { createBrowserRouter } from 'react-router-dom'
import { landingRoutes } from '@/modules/landing/routes'
import { authRoutes } from '@/modules/auth/routes'
import { customerRoutes } from '@/modules/customer/routes'

export const router = createBrowserRouter([
  ...landingRoutes,
  ...authRoutes,
  ...customerRoutes,
])
