import { readSaveFilesByUserId } from "@/actions/saveFile";
import { useQuery } from "@tanstack/react-query";


export const useReadSaveFilesByUserId = () => useQuery({
    queryKey: [ "readSaveFilesByUserId" ],
    queryFn: async () => readSaveFilesByUserId("use"),
})