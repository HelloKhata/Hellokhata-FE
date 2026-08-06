import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createWarehouse, getWarehouses } from '@/services/warehouseServices';


export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarehouse,
    mutationKey: ["create-warehouse"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};

export const useGetWarehouses = () => {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: getWarehouses,
    select: data => data.data
  });
};
