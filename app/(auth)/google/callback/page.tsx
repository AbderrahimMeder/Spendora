"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login");
      return;
    }
    const fetchUser = async () => {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
      const data = await res.json();
      if (data.status === 200) {
        toast.success(data.message);
        router.replace("/dashboard");
      }
    }
    fetchUser();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      Signing you in...
    </div>
  );
}