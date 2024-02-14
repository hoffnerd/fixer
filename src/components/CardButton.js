"use client"

import { Card, CardBtn, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"



//______________________________________________________________________________________
// ===== Component =====
export default function CardButton({children, className, title, description, onClick}) {

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <CardBtn 
            onClick={() => onClick ? onClick() : console.error("No onClick function given.")}
            className={`w-full hover:bg-accent hover:text-accent-foreground hover:cursor-pointer ${className}`}
        >
            <CardHeader>
                {title && <CardTitle className="text-lg">{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            {children && <CardContent>{children}</CardContent>}
        </CardBtn>
    )
}