import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OtpVerificationPage from './pages/OtpVerificationPage'
import MfaSetupPage from './pages/MfaSetupPage'

export const authRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/otp',
    element: <OtpVerificationPage />,
  },
  {
    path: '/mfa-setup',
    element: <MfaSetupPage />,
  },
]
