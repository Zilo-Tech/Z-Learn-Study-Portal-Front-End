import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { AuthForm } from "../components/auth-form";
import Image from "next/image";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/signup"
                className="font-medium text-brand hover:text-brand/80"
              >
                Sign up
              </a>
            </p>
          </div>
          <AuthForm />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          src="/auth-background.jpg"
          alt="Authentication background"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}