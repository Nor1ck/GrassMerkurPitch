"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "@/components/typography/SplitText";
import { useSplitScale } from "@/components/typography/useSplitScale";
import { Section } from "@/components/layout/Section";
import { scheduleScrollTriggerRefresh } from "@/lib/scrollTriggerRefresh";

gsap.registerPlugin(ScrollTrigger);

type TabKey = "heute" | "potenziale" | "morgen";

type Item = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  list?: string[];
  bodyAfterList?: string;
};

type Tab = {
  key: TabKey;
  label: string;
  items: Item[];
};

const todayItems: Item[] = [
  {
    id: "today-1",
    title: "Drei strategisch verzahnte Geschäftsfelder",
    subtitle: "Co-Location. Managed Services. Consulting.",
    body:
      "Drei klar definierte Leistungscluster, die Infrastruktur, Betrieb und Beratung miteinander verbinden und so ganzheitliche Verantwortung ermöglichen."
  },
  {
    id: "today-2",
    title: "Netzwerkbasierte Kundengewinnung auf Entscheider-Ebene",
    subtitle: "Kein Zufall. Sondern Vertrauen, das sich bewährt hat.",
    body:
      "Neue Kunden entstehen über ein über Jahre gewachsenes Netzwerk, persönliche Beziehungen und Empfehlungen zufriedener Bestandskunden."
  },
  {
    id: "today-3",
    title: "Hoher Vertrauensfaktor bei langjährigen Bestandskunden",
    subtitle: "Grass-Merkur entwickelt keine Kunden, sondern Vertrauen.",
    body:
      "Kunden geben kritische Systeme, sensible Daten und unternehmenskritische Prozesse in die Hände von Grass-Merkur. Das ist keine Kunden-Lieferanten-Beziehung. Das ist Vertrauen auf Infrastruktur-Ebene."
  }
];

const potentialsItems: Item[] = [
  {
    id: "pot-1",
    title: "Digitale Präsenz in Entscheidungsphasen",
    subtitle: "Heute entsteht Sichtbarkeit primär über Netzwerk.",
    body:
      "Potenzial liegt in zusätzlicher Präsenz bei Google, in KI-Systemen und auf LinkedIn – dort, wo Entscheider recherchieren und sich absichern."
  },
  {
    id: "pot-2",
    title: "Strategische Positionierung statt reiner Infrastruktur-Wahrnehmung",
    subtitle: "Grass-Merkur könnte klarer als strategischer IT-Partner auftreten.",
    body:
      "Mit Infrastruktur, Managed Services und Consulting aus einer Hand. Nicht nur als Betreiber, sondern noch mehr als Verantwortungspartner."
  },
  {
    id: "pot-3",
    title: "Regulatorischer Rückenwind als Wachstumshebel",
    subtitle: "KRITIS & NIS2 erhöhen den Handlungsdruck im Markt.",
    body:
      "Grass-Merkur hat die Kompetenz, sich als Ansprechpartner für sichere, regulatorisch belastbare IT-Infrastruktur zu positionieren."
  }
];

const tomorrowItems: Item[] = [
  {
    id: "mor-1",
    title: "Systematische Sichtbarkeit",
    subtitle: "Grass-Merkur ist bei Entscheidern präsent. Genau dort, wo Entscheider recherchieren, vergleichen und absichern.",
    body: "",
    list: [
      "Google",
      "in KI-gestützten Recherche-Systemen",
      "auf LinkedIn und relevanten Fachplattformen"
    ],
    bodyAfterList:
      "Nicht personenabhängig, nicht zufallsgetrieben, sondern mit klaren Vertriebssystemen, messbarer Sichtbarkeit und kontinuierlichen qualifizierten Anfragen. Wachstum wird planbar."
  },
  {
    id: "mor-2",
    title: "Klare Positionierung als strategischer IT-Partner",
    subtitle: "Der Markt nimmt Grass-Merkur als strategischen Partner wahr. Als vertrauenswürdigen Partner für",
    body: "",
    list: [
      "Hybrid-IT-Architekturen",
      "sichere Cloud-Integration",
      "IT-Transformation mit echter Verantwortung"
    ],
    bodyAfterList:
      "Infrastruktur, Managed Services und Consulting werden als integrierte Kompetenz verstanden – nicht als einzelne Leistungen."
  },
  {
    id: "mor-3",
    title: "Kompetenzzentrum für sichere, regulatorisch belastbare IT",
    subtitle:
      "Grass-Merkur wird Orientierungspunkt für KRITIS- und NIS2-Anforderungen. Grass-Merkur wird der Ansprechpartner für:",
    body: "",
    list: [
      "regulatorische Sicherheit",
      "Compliance",
      "belastbare Infrastruktur",
      "langfristige Stabilität"
    ],
    bodyAfterList:
      "Damit ist Grass-Merkur nicht der nächste Anbieter, sondern die Referenz."
  }
];

const tabs: Tab[] = [
  {
    key: "heute",
    label: "Heute",
    items: todayItems
  },
  {
    key: "potenziale",
    label: "Potenziale",
    items: potentialsItems
  },
  {
    key: "morgen",
    label: "Morgen",
    items: tomorrowItems
  }
];

export default function TodayTomorrowSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("heute");
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hasMountedTabRefreshRef = useRef(false);

  useSplitScale({ scope: sectionRef });

  useGSAP(
    () => {
      if (!sectionRef.current || !tabsRef.current || !contentRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;

      if (prefersReducedMotion || isMobile) {
        gsap.set([tabsRef.current, contentRef.current], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        [tabsRef.current, contentRef.current],
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
          stagger: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    if (!contentRef.current) return;

    if (!hasMountedTabRefreshRef.current) {
      hasMountedTabRefreshRef.current = true;
      return;
    }

    scheduleScrollTriggerRefresh({ trailingDelayMs: 140 });
  }, [activeTab]);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl || typeof ResizeObserver === "undefined") return;

    let previousHeight = Math.round(contentEl.getBoundingClientRect().height);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nextHeight = Math.round(
        entry?.contentRect.height ?? contentEl.getBoundingClientRect().height
      );
      if (Math.abs(nextHeight - previousHeight) < 1) return;
      previousHeight = nextHeight;
      scheduleScrollTriggerRefresh({ trailingDelayMs: 120 });
    });

    observer.observe(contentEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleTabClick = (key: TabKey) => {
    if (key === activeTab) return;
    setActiveTab(key);
  };

  return (
    <Section
      ref={sectionRef}
      className="flex w-full justify-center bg-[#080716] lg:!px-0"
      innerClassName="w-full"
      useContentWrap={false}
    >
      <div className="content-wrap">
        <div className="flex flex-col gap-16 text-center text-pretty">
          <SplitText
            text="HEUTE VS. MORGEN"
            split="words"
            as="h2"
            className="split-scale relative z-[1] text-fs-ui-800 font-extrabold uppercase tracking-wide text-white [font-family:var(--font-display)]"
            childClassName="inline-block"
          />
          <div className="flex flex-col gap-8">
            <div ref={tabsRef} className="flex w-full items-center justify-center pb-8">
              <div className="tabs-glow relative z-[1] flex flex-row flex-wrap items-center justify-center gap-4">
                {tabs.map((tab) => {
                  const isActive = tab.key === activeTab;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleTabClick(tab.key)}
                      className={
                        "relative z-10 rounded-full border border-white/50 px-6 py-3 text-fs-ui-100 font-normal uppercase tracking-widest transition-colors duration-300 " +
                        (isActive
                          ? "bg-[#DBC18D] text-[#080716] !border-[#DBC18D]"
                          : "text-white hover:bg-[#DBC18D] hover:text-[#080716] hover:!border-[#DBC18D]")
                      }
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div ref={contentRef} className="w-full relative z-[1]">
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={
                    "w-full rounded-[40px] bg-[#080716] p-4 text-left text-white transition-opacity duration-300 lg:px-24 " +
                    (tab.key === activeTab ? "block opacity-100" : "hidden opacity-0")
                  }
                >
                  <div className="flex flex-col gap-6">
                    {tab.items.map((item) => (
                      <div
                        key={item.id}
                        className="card-gradient-hover flex flex-row items-center gap-12 rounded-[40px] border border-[#DBC18D]/30 p-4 transition-[border-color] duration-300 ease-out hover:border-[#DBC18D]/50 [--card-bg:linear-gradient(0deg,#080716_0%,#080716_100%)] [--card-hover-bg:linear-gradient(0deg,#082940_0%,#080716_100%)] lg:p-8"
                      >
                        <div className="card-content flex w-full flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:gap-12 lg:text-left">
                          {/** keep layout stable per item */}
                          <div className="shrink-0 grow-0 basis-auto">
                            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#DBC18D]/30 bg-transparent lg:h-[80px] lg:w-[80px]">
                              <img
                                src="/assets/icons/Vector.svg"
                                alt=""
                                className="h-auto w-3 lg:w-4"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col gap-3 p-0">
                              <h3 className="text-fs-ui-200 font-semibold text-white normal-case [font-family:var(--font-display)]">
                                {item.title}
                              </h3>
                              <h4
                                className={
                                  "text-fs-ui-100 text-[#DBC18D] [font-family:var(--font-display)] " +
                                  (tab.key === "morgen" ? "font-bold" : "font-normal")
                                }
                              >
                                {item.subtitle}
                              </h4>
                              {tab.key === "morgen" && item.body ? (
                                <p className="text-fs-ui-100 font-normal text-[#DBC18D] [font-family:var(--font-display)]">
                                  {item.body}
                                </p>
                              ) : null}
                            </div>
                            {tab.key !== "morgen" && item.body ? (
                              <p className="mt-5 text-fs-ui-100 font-normal text-white [font-family:var(--font-display)]">
                                {item.body}
                              </p>
                            ) : null}
                            {item.list ? (
                              <ul className="mt-5 w-full list-disc pl-5 text-left text-fs-ui-100 font-normal text-white [font-family:var(--font-display)]">
                                {item.list.map((entry) => (
                                  <li key={entry} className="text-fs-ui-100">
                                    {entry}
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {item.bodyAfterList ? (
                              <p className="mt-5 text-fs-ui-100 font-normal text-white [font-family:var(--font-display)]">
                                {item.bodyAfterList}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
