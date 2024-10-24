"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from "@/components/ui/card";

const Verification = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // Initialize countdown

  useEffect(() => {
    // Countdown logic
    const countdownInterval = setInterval(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          // Redirect when countdown finishes
          clearInterval(countdownInterval);
          router.push('/complete-registration');
          return 0;
        }
        return currentCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);


  return (
    <div className="outer_card" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(14px)" }}>
      <Card className="card flex-col items-center justify-center p-12">
        <CardHeader className="flex-col items-center justify-center gap-3">
          <img src="/assets/images/checked.png" alt="Verified" width={120} height={120} />
          <h1 className="text-lg font-mont pt-4 text-center lg:w-[409px]">
            Your account has been verified successfully. Redirecting in {countdown}...
          </h1>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Verification;
