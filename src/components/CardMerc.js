import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card"

export default function CardMerc({children, className="", title="", description=""}) {
    return (
        <Card className={`${className} w-full`}>
            <CardHeader>
                {title && <CardTitle className="text-lg">{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            {children && <CardContent>{children}</CardContent>}
        </Card>
    )
}