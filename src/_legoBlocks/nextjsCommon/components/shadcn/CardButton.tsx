"use client"

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Stores ---------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import { CardButton as CardBtn, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Micro-Components =====






//______________________________________________________________________________________
// ===== Component =====

export default function CardButton({ 
    children,
    className,
    classNames,
    onClick,
    disabled=false,
    title,
    description
} : Readonly<{
    children?: React.ReactNode,
    className?: string,
    classNames?: { cardHeader?:string; cardTitle?:string; cardDescription?:string; }, 
    onClick: () => void,
    disabled?: boolean,
    title?: React.ReactNode | string,
    description?: React.ReactNode | string,
}>){

    //______________________________________________________________________________________
    // ===== Component Return =====
    return (
        <CardBtn className={className} onClick={onClick} disabled={disabled}>
            <CardHeader className={classNames?.cardHeader}>
                {title && <CardTitle className={classNames?.cardTitle}>{title}</CardTitle>}
                {description && <CardDescription className={classNames?.cardDescription}>{description}</CardDescription>}
            </CardHeader>
            {children}
        </CardBtn>
    )
}