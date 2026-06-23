import { createBrowserRouter } from 'react-router-dom'
import { landingRoutes } from '@/modules/landing/routes'
import { authRoutes } from '@/modules/auth/routes'

export const router = createBrowserRouter([
  ...landingRoutes,
  ...authRoutes,
])
