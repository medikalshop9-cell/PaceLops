import { useNavigate } from 'react-router-dom'
import { SignupForm } from '@/components/signup-form'
import { AuthLayout } from '@/shared/layouts/AuthLayout'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <SignupForm onLoginClick={() => navigate('/login')} />
    </AuthLayout>
  )
}
