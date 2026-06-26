import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import logoMark from "@/assets/images/parcelops_logo_mark.png";
import { LoadingTransition } from "@/shared/components/LoadingTransition/LoadingTransition";

export function SignupForm({
  className,
  onLoginClick,
  ...props
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");

        setFormData({
          full_name: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        setIsNavigating(true);
        setTimeout(() => {
          navigate("/customer");
        }, 1500);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] border-border/40 border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2.5 pb-2">
            <img
              src={logoMark}
              alt="ParcelOps"
              className="w-7 h-7 object-contain"
            />
            <span className="text-xl font-semibold tracking-tight text-foreground">
              ParcelOps
            </span>
          </div>

          <CardTitle className="text-[20px] font-medium">
            Create an account
          </CardTitle>

          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">
                  Full Name
                </FieldLabel>

                <Input
                  id="name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-10"
                />

                <FieldDescription>
                  We&apos;ll use this to contact you.
                  We will not share your email with anyone else.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Eye off icon (visible when password is shown)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      // Eye on icon (default, password hidden)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>

              <FieldGroup>
                <Field>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors font-semibold"
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="h-10 w-full mt-2 bg-background hover:bg-accent text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>

                    Sign up with Google
                  </Button>

                  <FieldDescription className="text-center pt-2">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={onLoginClick}
                      className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
                    >
                      Sign in
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-muted-foreground/80">
        By clicking create account, you agree to our{" "}
        <a
          href="#"
          className="underline hover:text-foreground"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline hover:text-foreground"
        >
          Privacy Policy
        </a>.
      </FieldDescription>

      <LoadingTransition isVisible={isNavigating} message="Creating your account..." />
    </div>
  );
}