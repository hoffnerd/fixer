// Packages -------------------------------------------------------------------------
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// Components -----------------------------------------------------------------------
import NavigationUser from "@/components/NavigationUser";
import NewSaveFile from "@/components/SaveFile/NewSaveFile";
import Loading from "@/components/Loading";
import SaveFiles from "./_components/SaveFiles";
import { readSaveFilesByUserId } from "@/actions/saveFile";
// Other ----------------------------------------------------------------------------



//______________________________________________________________________________________
// ===== Component  =====
export default async function Page(){

    const saveFiles = await readSaveFilesByUserId("page");

    return <>
        <div className="sticky top-0">
            <div className="flex flex-row-reverse">
                <NavigationUser/>
            </div>
        </div>
        <div className="container">
            <h1 className="text-5xl font-black pb-10">My Saves</h1>
            <NewSaveFile/>
            {/* <SaveFiles/> */}
            <SaveFiles initialSaveFiles={saveFiles}/>
        </div>
    </>

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [ "readSaveFilesByUserId" ],
        queryFn: async () => readSaveFilesByUserId("pre")
    })

    //______________________________________________________________________________________
    // ===== Component Return  =====
    return <>
        <div className="sticky top-0">
            <div className="flex flex-row-reverse">
                <NavigationUser/>
            </div>
        </div>
        <div className="container">
            <h1 className="text-5xl font-black pb-10">My Saves</h1>
            <NewSaveFile/>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <SaveFiles/>
            </HydrationBoundary>
        </div>
    </>
} 