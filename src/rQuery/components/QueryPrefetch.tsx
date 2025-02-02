// Types ----------------------------------------------------------------------------
// Packages -------------------------------------------------------------------------
import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
// Server ---------------------------------------------------------------------------
// rQuery ---------------------------------------------------------------------------
import { getQueryClient } from "@/rQuery/getQueryClient";
// Components -----------------------------------------------------------------------
import Loader from '@/_nextjsCommon/components/Loader';
// Data -----------------------------------------------------------------------------
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component =====

export default async function QueryPrefetch({
    children,
    fallback,
    queryOptions,
}: Readonly<{ 
    children: React.ReactNode;
    fallback?: React.ReactNode;
    queryOptions: any;
}>){
    
    //______________________________________________________________________________________
    // ===== React Query =====
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(queryOptions);
    
    //______________________________________________________________________________________
    // ===== Component Return =====
    return(
        <Suspense fallback={fallback || <Loader/>}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
            </HydrationBoundary>
        </Suspense>
    )
}