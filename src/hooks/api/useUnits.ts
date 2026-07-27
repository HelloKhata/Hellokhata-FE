import { useMutation, useQuery } from "@tanstack/react-query"
import { createUnit, getUnits } from "@/services/units.services"

export const useCreateUnits = () =>{
    return useMutation({
        mutationFn: createUnit,
    })
};


export const useGetUnits = () =>{
    return useQuery({
        queryKey:['units'],
        queryFn: getUnits,
        select: data => data.data
    })
}