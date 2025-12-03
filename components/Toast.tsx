"use client"

import { useEffect, useState } from "react"
import {
    Toast,
    ToastTitle,
    ToastDescription,
    ToastViewport,
    ToastProvider,
    ToastClose,
} from "@/components/ui/toast"

export default function GeneralToast({
    variant,
    title,
    description,
}: {
    variant: "success" | "error" | "warning" | "info"
    title: string
    description: string
}) {
    const [open, setOpen] = useState(true)

    const persistent = variant === "info" // info stays forever

    useEffect(() => {
        if (!persistent) {
            const timer = setTimeout(() => setOpen(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [persistent])

    const styles = {
        success: {
            bg: "bg-green-500",
            text: "text-white",
            shadow: "shadow-green-500/40",
            icon: "✅",
        },
        error: {
            bg: "bg-red-500",
            text: "text-white",
            shadow: "shadow-red-500/40",
            icon: "❗",
        },
        warning: {
            bg: "bg-yellow-300",
            text: "text-black",
            shadow: "shadow-yellow-500/40",
            icon: "⚠️",
        },
        info: {
            bg: "bg-blue-500",
            text: "text-white",
            shadow: "shadow-blue-500/40",
            icon: "❕",
        },
    }[variant]

    return (
        <ToastProvider>
            <Toast
                open={open}
                onOpenChange={setOpen}
                duration={persistent ? Infinity : 3000}
                className={`
          ${styles.bg} ${styles.shadow}
          rounded-md p-5 flex items-start gap-4
          ${styles.text}
        `}
            >

                <div className="flex flex-col gap-1">
                    <ToastTitle className={`${styles.text} font-semibold`}>
                        {title}
                    </ToastTitle>

                    <ToastDescription className={`${styles.text} opacity-90`}>
                        {description}
                    </ToastDescription>
                </div>
            </Toast>

            <ToastViewport className="!fixed !top-4 !right-4 !bottom-auto z-[100] flex flex-col gap-3 max-w-xs w-auto" />
        </ToastProvider>
    )
}
