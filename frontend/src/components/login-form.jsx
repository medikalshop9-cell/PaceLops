import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import logoMark from '@/assets/images/parcelops_logo_mark.png'

export function LoginForm({
  className,
  onSignupClick,
  ...props
}) {
  const [step, setStep] = useState('login')
  const [otpEmail, setOtpEmail] = useState('')
  const navigate = useNavigate()

  const handleOtpSubmit = (e) => {
    e.preventDefault()
    if (otpEmail) {
      navigate('/otp', { state: { email: otpEmail } })
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border-border/40 border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2.5 pb-2">
            <img src={logoMark} alt="ParcelOps" className="w-7 h-7 object-contain" />
            <span className="text-xl font-semibold tracking-tight text-slate-900">ParcelOps</span>
          </div>
          <CardTitle className="text-[20px] font-medium">Welcome back</CardTitle>
          <CardDescription>
            {step === 'login' ? 'Login with your Apple or Google account' : 'Enter your email to receive a login code'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 'otp-email' ? handleOtpSubmit : undefined}>
            {step === 'login' ? (
              <FieldGroup>
                <Field>
                  <Button variant="outline" type="button" className="h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor" />
                    </svg>
                    Login with Apple
                  </Button>
                  <Button variant="outline" type="button" className="h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor" />
                    </svg>
                    Login with Google
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="h-10 border-[#fe6b00]/30 hover:border-[#fe6b00]/50 hover:bg-[#fe6b00]/5 text-[#fe6b00]"
                    onClick={() => setStep('otp-email')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Continue with OTP
                  </Button>
                </Field>
                <FieldSeparator className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground *:data-[slot=field-separator-content]:bg-card">
                  OR CONTINUE WITH
                </FieldSeparator>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" placeholder="m@example.com" required className="h-10" />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a href="#" className="ml-auto text-sm text-[#fe6b00] underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required className="h-10" />
                </Field>
                <Field>
                  <Button type="submit" className="h-10 w-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors">
                    Login
                  </Button>
                  <FieldDescription className="text-center pt-2">
                    Don&apos;t have an account? <button type="button" onClick={onSignupClick} className="font-medium text-slate-900 hover:underline">Sign up</button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            ) : (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otpEmail">Email Address</FieldLabel>
                  <Input 
                    id="otpEmail" 
                    type="email" 
                    placeholder="m@example.com" 
                    required 
                    className="h-10" 
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    autoFocus
                  />
                </Field>
                <Field className="pt-2">
                  <Button type="submit" className="h-10 w-full bg-[#fe6b00] text-white hover:bg-[#e05e00] shadow-sm transition-colors">
                    Send Code
                  </Button>
                  <Button 
                    variant="ghost" 
                    type="button" 
                    className="h-10 w-full mt-2" 
                    onClick={() => setStep('login')}
                  >
                    Back to Login
                  </Button>
                </Field>
              </FieldGroup>
            )}
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground/80">
        By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-900">Terms of Service</a>{" "}
        and <a href="#" className="underline hover:text-slate-900">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
