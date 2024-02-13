"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import { readSaveFile, readSaveFilesByUserId, updateSaveFile } from "@/actions/saveFile";



export const useReadSaveFilesByUserId = () => useQuery({
    queryKey: [ "readSaveFilesByUserId" ],
    queryFn: async () => readSaveFilesByUserId(),
})

export const useReadSaveFile = (id) => useQuery({
    queryKey: [ `readSaveFile`, { id } ],
    queryFn: async () => { console.log({ trace:"useReadSaveFile > queryFn", id }); return readSaveFile(id); },
})

export const useUpdateSaveFile = () => useMutation({
    mutationFn: async ({id, inGameTime, additionalSaveData}) => updateSaveFile({id, inGameTime, additionalSaveData}),
    onSuccess: (data, variables) => variables.onSuccess(data, variables),
    onError: (error, variables) => variables.onError(error, variables),
})

//https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations