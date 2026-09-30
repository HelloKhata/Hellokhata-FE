import { createIncome, createIncomeCategory, deleteIncomeCategory, getIncomeCategories, getTransactions, updateIncomeCategory } from "@/services/finance.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTransactions = () =>{
    return useQuery({
        queryKey:['transactions'],
        queryFn: () =>   getTransactions(),
        select: (data) => data.data
    })
};

// income modules
// get all income categories
export const useGetIncomeCateogories = () =>{
    return useQuery({
        queryKey:['income-categories'],
        queryFn: () => getIncomeCategories(),   
        select: (data) => data.data
    })
};


// create income category
export const useCreateIncomeCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createIncomeCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['income-categories'] })
        }
    })
};

// update income category
export const useUpdateIncomeCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateIncomeCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['income-categories'] })
        }
    })
};

// delete income category
export const useDeleteIncomeCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteIncomeCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['income-categories'] })
        }
    })
};


// income 
export const useCreateIncome = () =>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createIncome,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        }
    })
}