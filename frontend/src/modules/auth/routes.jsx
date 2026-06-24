import LoginPage from './pages/LoginPage'
import OtpVerificationPage from './pages/OtpVerificationPage'

export const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/otp',
    element: <OtpVerificationPage />,
  },
]
