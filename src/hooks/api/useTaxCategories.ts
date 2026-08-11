import { createTaxCategories, getTaxCategories, updateTaxCategory } from "@/services/taxCategoriesServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateTaxCategories =() =>{
    const queryClient = useQueryClient();
    return  useMutation({
        mutationFn: createTaxCategories,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tax-categories'] });
        }
    })
};

export const useGetTaxCategories = () =>{
    return useQuery({
        queryKey:['tax-categories'],
        queryFn: getTaxCategories,
        select: data => data.data
    })
}

export const useUpdateTaxCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTaxCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tax-categories'] });
        }
    });
};


