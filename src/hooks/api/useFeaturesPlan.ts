
import { activatePlan, getFeaturesPlan, getMyFeatures } from "@/services/featuresPlan.services.";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetFeaturesPlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getFeaturesPlan,
        select: (data) => data.data
    })
};


export const useActivatePlan = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: activatePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myFeatures"] });
        }
    })
};

export const useGetMyFeatures = () => {
    return useQuery({
        queryKey: ['myFeatures'],
        queryFn: getMyFeatures,
        select: (data) => data.data
    })
}