import { useState } from 'react'
import { LoginForm } from '@/components/login-form'
import { SignupForm } from '@/components/signup-form'

export default function LoginPage() {
  const [view, setView] = useState('login')

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-[380px]">
        {view === 'login' ? (
          <LoginForm onSignupClick={() => setView('signup')} />
        ) : (
          <SignupForm onLoginClick={() => setView('login')} />
        )}
      </div>
    </div>
  )
}
