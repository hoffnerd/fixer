
import { useMutation, useQuery } from "@tanstack/react-query";
import { readSaveFile, readSaveFilesByUserId, updateSaveFile } from "@/actions/saveFile";



export const useReadSaveFilesByUserId = () => useQuery({
    queryKey: [ "readSaveFilesByUserId" ],
    queryFn: async () => readSaveFilesByUserId("use"),
})

export const useReadSaveFile = (id) => useQuery({
    queryKey: [ "readSaveFile" ],
    queryFn: async () => readSaveFile(id),
})

export const useUpdateSaveFile = () => useMutation({
    mutationFn: async (id, inGameTime, saveData) => updateSaveFile(id, inGameTime, saveData),
})

//https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations