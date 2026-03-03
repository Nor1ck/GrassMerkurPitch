"use client";

import { useRef } from "react";
import type { UIEvent as ReactUIEvent, WheelEvent as ReactWheelEvent } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSplitLines } from "@/components/typography/useSplitLines";
import { useSplitScale } from "@/components/typography/useSplitScale";
import { Section } from "@/components/layout/Section";

const detailSlides = [
  {
    title: "S1 – STRATEGIE & MARKE",
    subline: "Fundament schaffen, bevor Maßnahmen starten.",
    mediaType: "videoLeft",
    mediaSrc: "/assets/sections/modell-detail/Martin 1X1 - Clean 28RF - kompimiert.mp4",
    body: "Hier entsteht Klarheit. Ohne sie wird Wachstum beliebig und zufällig.",
    list: [
      "Bestandsaufnahme Marketing- & Vertriebssystem",
      "Positionierungs-Workshop",
      "Zielgruppen- & Entscheideranalyse",
      "Argumentationslogik für Entscheider",
      "Angebots- & Leistungsarchitektur",
      "Corporate Identity & Messaging",
      "Wettbewerbsanalyse"
    ]
  },
  {
    title: "S2 – SICHTBARKEIT",
    subline: "Relevanz in Entscheidungsphasen aufbauen.",
    mediaType: "videoLeft",
    mediaSrc: "/assets/sections/modell-detail/video-mock-up 1_1.mp4",
    body: "Nicht Reichweite ist das Ziel – sondern Wahrnehmung bei den richtigen Entscheidern.",
    list: [
      "SEO & GEO (inkl. Nischen wie „Lift & Shift“)",
      "Sichtbarkeit in KI-Systemen & LLMs",
      "LinkedIn-Strategie & Reputationsmarketing über Thought Leadership Contents",
      "Blogmarketing, White Papers & Fachartikel",
      "Videomarketing (Erklärung komplexer Leistungen)",
      "Podcasting",
      "Event Marketing",
      "Empfehlungsmarketing",
      "Website-Relaunch, Landing Pages & Conversion-Optimierung",
      "Reichweitenkampagnen",
      "Retargeting & Sichtbarkeits-Logiken",
      "Fotoshootings"
    ]
  },
  {
    title: "S3 – SYSTEME",
    subline: "Neukunden- und Recruitingprozesse reproduzierbar machen.",
    mediaType: "videoLeft",
    mediaSrc: "/assets/sections/modell-detail/video-mock-up 2.mp4",
    body: "Wachstum darf nicht vom Zufall oder einzelnen Personen abhängen.",
    list: [
      "Strukturierter Neukunden-Funnel",
      "Event-Formate mit strukturiertem Follow-up",
      "LinkedIn-Automations & Account-Based-Marketing",
      "CRM-Setup & Lead-Management",
      "Newsletter-Marketing",
      "KPI-Tracking & Performance-Dashboards",
      "Social Recruiting",
      "Recruiting-Funnels & Bewerber-Landingpages"
    ]
  },
  {
    title: "S4 – STRUKTUR",
    subline: "Organisation stabilisieren, während sie wächst.",
    mediaType: "video",
    mediaSrc: "/assets/sections/modell-detail/video-background-struktur.mp4",
    panelStyle: "overlay",
    body: "Mehr Nachfrage bedeutet mehr Komplexität. Struktur verhindert Unruhe.",
    list: [
      "Prozessanalyse & Optimierung",
      "Rollen- und Verantwortlichkeitsdefinition",
      "interne KPI-Systeme",
      "Automatisierung von Standardprozessen",
      "Schnittstellenoptimierung zwischen Marketing & Vertrieb"
    ]
  },
  {
    title: "S5 – SKALIERUNG",
    subline: "Führung und Organisation auf die nächste Stufe bringen.",
    mediaType: "video",
    mediaSrc: "/assets/sections/modell-detail/video-background-skalierung.mp4",
    panelStyle: "overlay",
    body: "Wachstum endet nicht bei Leads. Es endet in der Führung.",
    list: [
      "Führungsworkshops",
      "Vertriebstrainings",
      "Strategische Roadmaps",
      "Skalierungsplanung für neue Geschäftsfelder",
      "Organisationsentwicklung",
      "Management-Sparring"
    ]
  }
];

export default function ModellDetailSection() {
  const LIST_SCROLL_GUARD_MS = 200;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const listScrollGuardUntilRef = useRef(0);

  useSplitScale({ scope: sectionRef });
  useSplitLines({ scope: sectionRef });

  const markListScrollGuard = () => {
    listScrollGuardUntilRef.current = Date.now() + LIST_SCROLL_GUARD_MS;
  };

  const isListScrollGuardActive = () => Date.now() < listScrollGuardUntilRef.current;

  const isScrollBlocked = () => isAnimatingRef.current || isListScrollGuardActive();

  useGSAP(
    () => {
      if (!stackRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!stackRef.current) return;

        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        if (!cards.length) return;

        const count = cards.length;
        const SLIDE_SWITCH_THRESHOLD = 0.30;
        const SLIDE_SWITCH_BIAS = 1 - SLIDE_SWITCH_THRESHOLD;

        cards.forEach((card, index) => {
          gsap.set(card, {
            yPercent: index === 0 ? 0 : 100,
            autoAlpha: index === 0 ? 1 : 0,
            zIndex: index + 1
          });
        });

        let trigger: ScrollTrigger | null = null;
        const clampIndex = (value: number) =>
          Math.min(count - 1, Math.max(0, value));

        const animateToIndex = (targetIndex: number) => {
          if (isAnimatingRef.current) return;

          const currentIndex = activeIndexRef.current;
          if (targetIndex === currentIndex) return;

          const direction = targetIndex > currentIndex ? 1 : -1;
          const nextCard = cards[targetIndex];
          const currentCard = cards[currentIndex];

          isAnimatingRef.current = true;

          const tl = gsap.timeline({
            defaults: { duration: 0.6, ease: "power2.out" },
            onComplete: () => {
              activeIndexRef.current = targetIndex;
              isAnimatingRef.current = false;
            }
          });

          if (direction > 0) {
            gsap.set(nextCard, { yPercent: 100, autoAlpha: 1 });
            tl.to(nextCard, { yPercent: 0 });
          } else {
            tl.to(currentCard, { yPercent: 100, autoAlpha: 0 });
            gsap.set(nextCard, { yPercent: 0, autoAlpha: 1 });
          }
        };
        trigger = ScrollTrigger.create({
          trigger: stackRef.current,
          start: "top top",
          end: () => `+=${(count - 1) * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const desiredIndex = clampIndex(
              Math.floor(self.progress * (count - 1) + SLIDE_SWITCH_BIAS)
            );
            if (isScrollBlocked()) return;
            const currentIndex = activeIndexRef.current;
            if (!isAnimatingRef.current && desiredIndex !== currentIndex) {
              const direction = desiredIndex > currentIndex ? 1 : -1;
              const nextIndex = clampIndex(currentIndex + direction);
              animateToIndex(nextIndex);
            }
          }
        });

        const handleGuardWheel = (event: WheelEvent) => {
          if (!trigger?.isActive) return;
          if (!isListScrollGuardActive()) return;

          const activeList = listRefs.current[activeIndexRef.current];
          if (activeList && event.target instanceof Node && activeList.contains(event.target)) {
            return;
          }

          event.preventDefault();
        };

        window.addEventListener("wheel", handleGuardWheel, { passive: false });

        return () => {
          window.removeEventListener("wheel", handleGuardWheel);
          isAnimatingRef.current = false;
          trigger?.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const handleListWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const canScroll = target.scrollHeight > target.clientHeight + 1;
    if (!canScroll) return;
    markListScrollGuard();
    event.stopPropagation();
  };

  const handleListScroll = (event: ReactUIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const canScroll = target.scrollHeight > target.clientHeight + 1;
    if (!canScroll) return;
    markListScrollGuard();
  };

  return (
    <Section
      ref={sectionRef}
      className="mt-32 flex w-full flex-col items-center !px-0"
      innerClassName="w-full"
      useContentWrap={false}
    >
      <div className="content-wrap !max-w-[1280px] flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-2">
          <h2 className="split-scale text-balance">DIE 5-S-MODULE IM DETAIL</h2>
          <h3 className="split-scale text-balance font-light">5 MODULE FÜR SICHERES WACHSTUM</h3>
        </div>
        <p className="split-lines text-balance">
          Die 5-S-Module sind kein Maßnahmenkatalog. Sie sind ein strukturiertes System, das Wachstum
          planbar macht. Nicht alles gleichzeitig. Aber alles in der richtigen Reihenfolge.
        </p>
      </div>
      <div className="mt-24 w-full">
        <div
          ref={stackRef}
          className="relative w-full flex flex-col gap-10 lg:block lg:h-[100svh] lg:w-[100vw] lg:overflow-hidden"
        >
          {detailSlides.map((slide, index) => {
            const isSlideOne = index === 0;
            const isBackgroundVideo = slide.mediaType === "video";
            const panelClass =
              slide.mediaType === "video"
                ? "bg-[rgba(8,7,22,0.55)] backdrop-blur-sm lg:bg-[linear-gradient(270deg,rgba(8,7,22,0.60)_0%,#080716_100%)] lg:backdrop-blur-md"
                : slide.panelStyle === "overlay"
                  ? "bg-[linear-gradient(270deg,rgba(8,7,22,0.60)_0%,#080716_100%)] backdrop-blur-md"
                  : "";

            return (
              <div
                key={slide.title}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="flex w-full items-center justify-center overflow-hidden bg-[#080716] lg:absolute lg:inset-0 lg:h-[100svh] lg:w-[100vw]"
              >
                <div className="content-wrap w-full flex justify-center pb-[43px]">
                  <div
                    className="relative w-full overflow-hidden rounded-[20px] border border-[#37515F] bg-[#080716] lg:h-[90svh] lg:max-w-[90vw]"
                    style={
                      slide.mediaType === "bg"
                        ? {
                          backgroundImage: `url(${slide.mediaSrc})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }
                        : undefined
                    }
                  >
                    {slide.mediaType === "video" ? (
                      <video
                        className="absolute inset-0 hidden h-full w-full object-cover lg:block"
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={slide.mediaSrc}
                      />
                    ) : null}
                    <div className="h-full w-full">
                      <div className="grid h-full grid-rows-[250px_auto] lg:grid-cols-2 lg:grid-rows-1">
                        <div
                          className={
                            "relative min-h-[250px] w-full overflow-hidden lg:h-full " +
                            (isBackgroundVideo ? "block lg:hidden" : "")
                          }
                        >
                          {slide.mediaType === "videoLeft" ? (
                            <div className={"h-full w-full " + (isSlideOne ? "" : "lg:py-4")}>
                              <video
                                className={
                                  "h-full w-full object-cover " +
                                  (isSlideOne ? "" : "lg:object-contain lg:object-left")
                                }
                                autoPlay
                                loop
                                muted
                                playsInline
                                src={slide.mediaSrc}
                              />
                            </div>
                          ) : null}
                          {slide.mediaType === "video" ? (
                            <video
                              className="h-full w-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                              src={slide.mediaSrc}
                            />
                          ) : null}
                          {slide.mediaType === "image" ? (
                            <img
                              src={slide.mediaSrc}
                              alt=""
                              className="h-full w-full object-cover lg:object-contain lg:object-left"
                            />
                          ) : null}
                        </div>
                        <div
                          className={
                            "relative z-[1] row-span-1 flex h-full flex-col justify-center px-4 lg:px-10 " +
                            (isBackgroundVideo ? "lg:col-start-2 " : "") +
                            panelClass
                          }
                        >
                          <div className="flex h-full flex-col items-center justify-center gap-6 py-8 text-center lg:items-start lg:py-16 lg:text-left">
                            <h3 className="text-center text-balance font-semibold lg:text-left">{slide.title}</h3>
                            <div className="flex flex-col gap-1">
                              <h4 className="text-center text-fs-ui-200 text-balance font-semibold lg:text-left">
                                {slide.subline}
                              </h4>
                              <p className="text-center text-balance text-[#DBC18D] lg:text-left">{slide.body}</p>
                            </div>
                            <div
                              ref={(el) => {
                                listRefs.current[index] = el;
                              }}
                              className="slide-list-scroll mt-4 flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden overscroll-contain pr-2 text-left"
                              onWheel={handleListWheel}
                              onScroll={handleListScroll}
                            >
                              {slide.list.map((entry) => (
                                <div key={entry} className="flex flex-nowrap items-center gap-2">
                                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[#DBC18D42]">
                                    <img
                                      src="/assets/sections/modell-detail/arrow-icon.svg"
                                      alt=""
                                      className="h-3 w-3"
                                    />
                                  </span>
                                  <p className="min-w-0 flex-shrink flex-grow-0 rounded-[30px] border border-[#DBC18D42] px-4 text-left text-balance py-2">
                                    {entry}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}


