"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import { readSaveFile, readSaveFilesByUserId, updateSaveFile } from "@/actions/saveFile";



export const useReadSaveFilesByUserId = () => useQuery({
    queryKey: [ "readSaveFilesByUserId" ],
    queryFn: async () => readSaveFilesByUserId(),
})

export const useReadSaveFile = (id) => useQuery({
    queryKey: [ `readSaveFile`, { id } ],
    queryFn: async () => readSaveFile(id),
})

export const useUpdateSaveFile = () => useMutation({
    mutationFn: async ({id, inGameTime, additionalSaveData}) => updateSaveFile(id, inGameTime, additionalSaveData),
    onSuccess: (data, variables) => variables.onSuccess(data, variables),
})

//https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations