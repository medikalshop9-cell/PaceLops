import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AuthLayout } from '@/shared/layouts/AuthLayout'
import logoMark from '@/assets/images/parcelops_logo_mark.png'

export default function MfaSetupPage() {
  const [step, setStep] = useState('setup') // 'setup' | 'verify'
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  // Dummy MFA secret for the QR code
  const mfaSecret = "JBSWY3DPEHPK3PXP"
  const qrUrl = `otpauth://totp/ParcelOps:user@example.com?secret=${mfaSecret}&issuer=ParcelOps`

  const backupCodes = [
    "1a2b-3c4d", "5e6f-7g8h",
    "9i0j-1k2l", "3m4n-5o6p",
    "7q8r-9s0t", "1u2v-3w4x"
  ]

  const handleVerify = (e) => {
    e.preventDefault()
    // Validation logic for 6-digit code would go here
    console.log("Verified MFA with code:", code)
    navigate('/login') // Navigate to dashboard or login on success
  }

  return (
    <AuthLayout>
      <Card className="shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border-border/40 border w-full max-w-[380px]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2.5 pb-2">
            <img src={logoMark} alt="ParcelOps" className="w-7 h-7 object-contain" />
            <span className="text-xl font-semibold tracking-tight text-slate-900">ParcelOps</span>
          </div>
          <CardTitle className="text-[20px] font-medium">Multi-Factor Authentication</CardTitle>
          <CardDescription>
            {step === 'setup' ? 'Scan this QR code using your authenticator app' : 'Enter the 6-digit code from your app'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'setup' ? (
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-3 rounded-lg border shadow-sm">
                <QRCodeSVG value={qrUrl} size={160} />
              </div>
              
              <div className="w-full space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 text-center">Backup Codes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="font-mono text-xs bg-muted p-2 rounded text-center border">
                      {code}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
                  Save these somewhere safe — each code works once if you lose access to your authenticator.
                </p>
              </div>

              <Button 
                className="w-full h-10 bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors" 
                onClick={() => setStep('verify')}
              >
                Complete Setup
              </Button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Input 
                  type="text"
                  placeholder="000000"
                  required
                  className="h-12 text-center tracking-[0.5em] text-2xl font-mono"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-10 bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors">
                Verify
              </Button>
              <Button type="button" variant="ghost" onClick={() => setStep('setup')} className="w-full h-10">
                Back to QR Code
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
