

// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
// Components -----------------------------------------------------------------------
import Loader from "@/components/Loader";
import { Alert } from "@/components/microComponents";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default function QueryHandler({
    isLoading,
    isError,
    isData,
    messageError,
    messageData,
    componentLoading,
    componentError,
    componentData,
    children,
}: Readonly<{ 
    isLoading: boolean;
    isError: boolean;
    isData: any;
    messageError?: string;
    messageData?: string;
    componentLoading?: React.ReactNode;
    componentError?: React.ReactNode;
    componentData?: React.ReactNode;
    children: React.ReactNode;
}>) {

    //______________________________________________________________________________________
    // ===== Component Return =====

    if(isLoading) return componentLoading || <Loader/>
    
    if(isError) return componentError || (
        <Alert className="neColorRed" variant="neonEffectWithGlow" title="Error!">
            {messageError || "A problem occurred reading data!"}
        </Alert>
    )

    if(!isData) return componentData || (
        <Alert className="neColorPurple" variant="neonEffectWithGlow" title="Information:">
            <span className="neonEffect neText neTextGlow neColorBlue">
                {messageData || "Looks like there might be some missing data!"}
            </span>
        </Alert>
    )

    return children;
}