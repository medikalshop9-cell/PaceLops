import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import logoMark from '@/assets/images/parcelops_logo_mark.png'
import { useState } from "react"

export default function OtpVerificationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || "your email address"
  const [code, setCode] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logic for verifying OTP would go here
    console.log("Verifying OTP for", email, ":", code)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-[380px] flex flex-col gap-6">
        <Card className="shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border-border/40 border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2.5 pb-2">
              <img src={logoMark} alt="ParcelOps" className="w-7 h-7 object-contain" />
              <span className="text-xl font-semibold tracking-tight text-slate-900">ParcelOps</span>
            </div>
            <CardTitle className="text-[20px] font-medium">Check your email</CardTitle>
            <CardDescription>
              We sent a login code to <span className="font-medium text-slate-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Input 
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                  className="h-10 text-center tracking-widest text-lg"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="h-10 w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors">
                Verify & Login
              </Button>
              <Button 
                variant="ghost" 
                type="button" 
                className="h-10 w-full" 
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
