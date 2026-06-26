import { Truck } from 'lucide-react'

export function LoadingTransition({ isVisible, message = "Preparing your dashboard..." }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-opacity">
      <div className="flex flex-col items-center gap-6 p-8 md:p-12 bg-card rounded-[32px] shadow-2xl border border-border/50">
        <div className="relative">
          {/* Pulsing ring background */}
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
          
          {/* Main icon container */}
          <div className="relative flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full border border-primary/20 shadow-inner">
            <Truck className="w-12 h-12 text-primary animate-bounce" />
          </div>
        </div>
        
        <div className="space-y-2 text-center mt-2">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">ParcelOps</h3>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">{message}</p>
        </div>
      </div>
    </div>
  )
}
