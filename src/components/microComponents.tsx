
// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Data -----------------------------------------------------------------------------
// Styles ---------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
// Other ----------------------------------------------------------------------------


/**
 * Renders a horizontal line with a specified className and lineClassName.
 */
export function HorizontalLine({ className, lineClassName }: Readonly<{ className?: string, lineClassName?: string }>){
    return (
        <div className={`px-3 ${className}`}>
            <div className={`border-2 rounded-3xl neonEffect neBorder neBorderGlow neColorWhite ${lineClassName}`}/>
        </div>
    )
}


// export function MotionDiv({children, className}:Readonly<{ children?:React.ReactNode, className?:string }>){
//     return <motion.div layout transition={{ ease: "linear", stiffness: 100 }} className={className}>{children}</motion.div>
// }