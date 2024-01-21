import { Terminal } from "lucide-react"
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "./shadcn/ui/alert"

export default function Alert({ variant="default", className="", terminal=true, title=null,  children }) {
    return (
        <ShadcnAlert variant={variant} className={className}>
            {terminal && <Terminal className="h-4 w-4" />}
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
        </ShadcnAlert>
    )
}