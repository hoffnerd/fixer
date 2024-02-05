
import { QueryClient } from "@tanstack/react-query";
import { readSaveFile, readSaveFilesByUserId } from "@/actions/saveFile"



const queryClient = new QueryClient();

export const prefetchSaveFilesByUserId = async () => {
    await queryClient.prefetchQuery({
        queryKey: [ "readSaveFilesByUserId" ],
        queryFn: async () => readSaveFilesByUserId()
    });
    return queryClient;
}

export const prefetchSaveFile = async (id) =>{ 
    await queryClient.prefetchQuery({
        queryKey: [ "readSaveFile" ],
        queryFn: async () => readSaveFile(id)
    });
    return queryClient;
}