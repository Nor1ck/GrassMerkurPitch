"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageBoot } from "@/components/providers/PageBootProvider";
import {
  cancelScheduledScrollTriggerRefresh,
  scheduleScrollTriggerRefresh
} from "@/lib/scrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTriggerStabilityProvider() {
  const { isBootReady } = usePageBoot();

  useEffect(() => {
    if (!isBootReady) return;

    const handleViewportChange = () => {
      scheduleScrollTriggerRefresh({ delayMs: 120, trailingDelayMs: 120 });
    };

    scheduleScrollTriggerRefresh({ trailingDelayMs: 160 });
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      cancelScheduledScrollTriggerRefresh();
    };
  }, [isBootReady]);

  return null;
}
