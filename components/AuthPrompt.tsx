"use client";
import React, { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";

export default function AuthPrompt() {
  const { authResolved, uid, openAuthModal } = useGameStore();
  const hasPrompted = useRef(false);

  useEffect(() => {
    if (authResolved && !uid && !hasPrompted.current) {
      hasPrompted.current = true;
      // Small delay to ensure the modal doesn't immediately flash before UI is fully ready
      setTimeout(() => {
        openAuthModal();
      }, 500);
    }
  }, [authResolved, uid, openAuthModal]);

  return null;
}
