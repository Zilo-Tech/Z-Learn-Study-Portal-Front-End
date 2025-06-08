"use client";
import { Logo } from "@/components/ui/logo";
import { AuthForm } from "../components/auth-form";
import { useEffect, useRef } from "react";

export default function SignUpPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Autoplay prevented:", e));
    }
  }, []);

  return (
    <div className="container relative flex min-h-screen flex-col justify-center sm:items-center md:grid lg:max-w-none lg:grid-cols-2 px-4 lg:px-0">
      {/* Video Background Section */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className="absolute inset-0 object-cover w-full h-full"

          poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          {/* Using a real educational/tech video from Pixabay */}
          <source src="https://cdn.pixabay.com/video/2022/12/11/142834-778693311_large.mp4" type="video/mp4" />
          {/* Fallback video from another CDN */}
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1c9a91a6d&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 " />

        {/* Content */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo color="white" />
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2 backdrop-blur-sm bg-black/30 p-6 rounded-lg">
            <p className="text-lg">
              <p className="text-lg">
                &quot;I went from beginner to job-ready in 3 months with Z-Learn&apos;s personalized learning paths.&quot;
              </p>

            </p>
            <footer className="text-sm">Michael Chen</footer>
          </blockquote>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <AuthForm type="signup" />
        </div>
      </div>
    </div>
  );
}