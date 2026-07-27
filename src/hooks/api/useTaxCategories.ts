import { createTaxCategories, getTaxCategories } from "@/services/taxCategoriesServices";
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateTaxCategories =() =>{
    return  useMutation({
        mutationFn: createTaxCategories
    })
};

export const useGetTaxCategories = () =>{
    return useQuery({
        queryKey:['tax-categories'],
        queryFn: getTaxCategories,
        select: data => data.data
    })
}