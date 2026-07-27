import { getItemsCategories } from "@/services/item.services";
import { createItemCategories } from "@/services/itemCategories.services"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateItemCategories  = () =>{
    return useMutation({
        mutationFn: createItemCategories,
    })
};

export const useGetItemsCategories = () => {
  return useQuery({
    queryKey: ["itemsCategory"],
    queryFn: getItemsCategories,
    select: data => data.data
  });
};
