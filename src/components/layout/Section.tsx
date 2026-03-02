"use client";

import type React from "react";
import { forwardRef } from "react";

type SectionProps = {
  as?: "section" | "div";
  className?: string;
  innerClassName?: string;
  useContentWrap?: boolean;
  centerY?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    as = "section",
    className = "",
    innerClassName = "",
    useContentWrap = true,
    centerY = false,
    children
  },
  ref
) {
  const Component = as as React.ElementType;
  const outerClassName = [
    "min-h-0 w-full px-0 lg:min-h-[100svh] lg:px-8 flex justify-center",
    centerY ? "items-center" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  const innerClasses = useContentWrap
    ? ["content-wrap w-full", innerClassName].filter(Boolean).join(" ")
    : innerClassName;

  return (
    <Component ref={ref as unknown as React.Ref<any>} className={outerClassName}>
      <div className={innerClasses}>{children}</div>
    </Component>
  );
});
