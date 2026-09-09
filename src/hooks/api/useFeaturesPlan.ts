
import client from "@/lib/axios";
import { activatePlan, getFeaturesPlan } from "@/services/featuresPlan";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetFeaturesPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getFeaturesPlan,
        select: (data) => data.data
    })
};


export const useActivatePlan = () =>{
    return useMutation({
        mutationFn: activatePlan
    })
};

export const useGetMyFeatures = () => {
    return useQuery({
        queryKey: ['myFeatures'],
        queryFn: getMyFeatures,
        select: (data) => data.data
    })
}