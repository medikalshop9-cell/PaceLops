import logoImage from '@/assets/images/logo.png'

export function AuthLayout({ children }) {
  return (
    <div className="flex min-h-svh w-full">
      {/* Brand Panel - Hidden on mobile, visible on large screens */}
      <div className="relative hidden lg:block lg:w-1/2 bg-slate-900">
        <img 
          src={logoImage} 
          alt="Brand Background" 
          className="absolute inset-0 h-full w-full object-cover" 
        />
      </div>
      
      {/* Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  )
}
