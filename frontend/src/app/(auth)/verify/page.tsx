"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, MailOpen, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { authApi } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

interface VerifyResponse {
  access_token: string
  user: {
    id: string
    email: string
    fullName: string
    isVip: boolean
  }
}

function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get("email")
  const setAuth = useAuthStore((state) => state.setAuth)

  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification link")
      router.push("/login")
    }
  }, [email])

  const handleVerify = async () => {
    if (!email || otp.length !== 6) return
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await authApi.verify(email, otp) as VerifyResponse

      setAuth(response.access_token, response.user)

      toast.success("Email verified successfully!", {
        description: "Welcome to your memory keeper.",
      })

      router.push("/")
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Verification failed"

      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (otp.length === 6) {
      const timer = setTimeout(() => handleVerify(), 250)
      return () => clearTimeout(timer)
    }
  }, [otp])

  return (
    <div className="space-y-6">
      {/* Header Icon */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center animate-pulse">
          <MailOpen className="w-8 h-8 text-secondary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to
          </p>
          <p className="font-medium text-foreground">{email}</p>
        </div>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center py-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={isLoading}
        >
          <InputOTPGroup className="gap-2">
            {[0,1,2,3,4,5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-12 w-10 md:h-14 md:w-12 text-lg rounded-xl border-border bg-background/50 
                focus:ring-secondary focus:border-secondary transition-all"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={isLoading || otp.length < 6}
        className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>

      {/* Resend */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Didn't receive code?</span>
        <button
          className="text-secondary hover:text-secondary/80 font-medium"
          onClick={() => toast.info("Resend feature coming soon")}
        >
          Resend
        </button>
      </div>

      {/* Back */}
      <div className="pt-4 text-center">
        <button
          disabled={isLoading}
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto 
          transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to registration
        </button>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <AuthLayout
      title="Check Your Email"
      subtitle="Please enter the verification code sent to your inbox"
      quote="Memories are timeless treasures of the heart."
      quoteAuthor="Unknown"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </AuthLayout>
  )
}
