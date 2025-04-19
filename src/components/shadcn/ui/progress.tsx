"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/shadcn";

function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { classNameIndicator?: string }) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn("absolute top-0 left-0 h-full w-full transition-all", props.classNameIndicator)}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

function ProgressCustom({
    props={},
    value,
    className,
    classNameIndicator,
}: Readonly<{ 
    props?:React.ComponentProps<typeof ProgressPrimitive.Root>; 
    value: number;
    className?: string;
    classNameIndicator?: string; 
}>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
                className,
            )}
            value={value}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn("absolute top-0 left-0 h-full w-full transition-all", classNameIndicator)}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress, ProgressCustom };

