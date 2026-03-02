"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseSplitScaleOptions = {
  scope: RefObject<HTMLElement | null>;
};

export function useSplitScale({ scope }: UseSplitScaleOptions) {
  useGSAP(
    () => {
      if (!scope.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;

      if (prefersReducedMotion || isMobile) {
        gsap.set(scope.current.querySelectorAll(".split-scale"), { opacity: 1, scale: 1 });
        return;
      }

      const targets = gsap.utils.toArray<HTMLElement>(".split-scale", scope.current);
      const tweens: gsap.core.Tween[] = [];

      targets.forEach((target) => {
        const tween = gsap.fromTo(
          target,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "elastic.out(1, 0.8)",
            duration: 1,
            scrollTrigger: {
              trigger: target,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true
            }
          }
        );
        tweens.push(tween);
      });

      return () => {
        tweens.forEach((tween) => tween.kill());
      };
    },
    { scope }
  );
}
