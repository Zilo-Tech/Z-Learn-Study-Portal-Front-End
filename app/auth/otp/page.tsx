"use client";
import { Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

function OTPContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  return (
    <div className="container min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We sent a confirmation link to {email ? <span className="font-medium text-gray-900">{email}</span> : "your email"}.<br />
          Please check your inbox and click the link to confirm your account.
        </p>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Didn’t receive the email? Check your spam folder or try again later.</p>
          <Link href="/auth/signin">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">Go to Sign in</Button>
          </Link>
          <Link href="/auth/signup" className="inline-flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPContent />
    </Suspense>
  );
}

