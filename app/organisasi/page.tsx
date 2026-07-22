"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrganisasiRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/stakeholder");
  }, [router]);

  return null;
}
