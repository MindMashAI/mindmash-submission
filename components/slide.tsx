"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import SlideLoader from "@/components/slide-loader"
import { useMobile } from "@/hooks/use-mobile"

interface SlideProps {
  children: ReactNode
  isActive: boolean
  slideIndex: number
}

export default function Slide({ children, isActive, slideIndex }: SlideProps) {
  const { isMobile } = useMobile()

  return (
    <div
      className={cn(
        "absolute inset-0 transition-all duration-500 ease-in-out p-6 md:overflow-hidden overflow-y-auto",
        isActive ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-full z-0",
      )}
    >
      <SlideLoader isActive={isActive} slideIndex={slideIndex}>
        <div className={cn("min-h-[calc(100vh-120px)] w-full", !isMobile && "h-full flex items-center justify-center")}>
          <div className="w-full max-w-6xl mx-auto">{children}</div>
        </div>
      </SlideLoader>
    </div>
  )
}
