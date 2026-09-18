"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    localStorage.setItem("token", token);

    router.replace("/dashboard");
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      Signing you in...
    </div>
  );
}