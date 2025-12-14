"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./lib/authContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  FloatingShapes,
  AnimatedSweets,
  LandingNav,
  HeroSection,
  FeaturesSection,
  CTASection,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingShapes />
      <AnimatedSweets />
      <LandingNav />
      <HeroSection mounted={mounted} />
      <FeaturesSection />

      <CTASection />
      <LandingFooter />
    </div>
  );
}
