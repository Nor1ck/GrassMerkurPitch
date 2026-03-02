"use client";

import { ScrollTrigger } from "@/lib/gsap";

type ScheduleScrollTriggerRefreshOptions = {
  delayMs?: number;
  trailingDelayMs?: number;
};

let rafIdOne: number | null = null;
let rafIdTwo: number | null = null;
let refreshTimeoutId: number | null = null;
let trailingTimeoutId: number | null = null;
let isRefreshing = false;
let hasPendingRefresh = false;

const clearQueuedRefresh = () => {
  if (rafIdOne !== null) {
    window.cancelAnimationFrame(rafIdOne);
    rafIdOne = null;
  }

  if (rafIdTwo !== null) {
    window.cancelAnimationFrame(rafIdTwo);
    rafIdTwo = null;
  }

  if (refreshTimeoutId !== null) {
    window.clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
};

const performRefresh = () => {
  if (isRefreshing) {
    hasPendingRefresh = true;
    return;
  }

  isRefreshing = true;
  try {
    ScrollTrigger.refresh();
  } finally {
    isRefreshing = false;
  }

  if (hasPendingRefresh) {
    hasPendingRefresh = false;
    scheduleScrollTriggerRefresh();
  }
};

const queueRefresh = (delayMs: number) => {
  clearQueuedRefresh();
  rafIdOne = window.requestAnimationFrame(() => {
    rafIdOne = null;
    rafIdTwo = window.requestAnimationFrame(() => {
      rafIdTwo = null;
      if (delayMs > 0) {
        refreshTimeoutId = window.setTimeout(() => {
          refreshTimeoutId = null;
          performRefresh();
        }, delayMs);
        return;
      }
      performRefresh();
    });
  });
};

export const scheduleScrollTriggerRefresh = ({
  delayMs = 0,
  trailingDelayMs = 0
}: ScheduleScrollTriggerRefreshOptions = {}) => {
  if (typeof window === "undefined") return;

  queueRefresh(delayMs);

  if (trailingTimeoutId !== null) {
    window.clearTimeout(trailingTimeoutId);
    trailingTimeoutId = null;
  }

  if (trailingDelayMs > 0) {
    trailingTimeoutId = window.setTimeout(() => {
      trailingTimeoutId = null;
      queueRefresh(0);
    }, trailingDelayMs);
  }
};

export const cancelScheduledScrollTriggerRefresh = () => {
  if (typeof window === "undefined") return;

  clearQueuedRefresh();

  if (trailingTimeoutId !== null) {
    window.clearTimeout(trailingTimeoutId);
    trailingTimeoutId = null;
  }

  hasPendingRefresh = false;
};
