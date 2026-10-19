import {
  getSalesReportSummary,
  getWhatDroveSales,
  getProfitMarginReport,
  getDueAgingReport,
  getDiscountsReport,
  getDeadStockReport,
  getSalesReport,
  getBestSellingProducts,
  getPurchaseReport,
  getInventoryReport,
} from "@/services/reports.services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetSalesReportSummary = (
  filter: any = {},
) => {
  return useQuery({
    queryKey: ["reports", "sales", "summary", filter],
    queryFn: () => getSalesReportSummary(filter),
    select: (data) => data?.data ?? data,
  });
};

export const useGetWhatDroveSales = (
  filter: any = {},
) => {
  return useQuery({
    queryKey: ["reports", "sales", "what-drove-sales", filter],
    queryFn: () => getWhatDroveSales(filter),
    select: (data) => data?.data ?? data,
  });
};

export const useGetProfitMarginReport = (
  filter: any = {},
) => {
  return useQuery({
    queryKey: ["reports", "sales", "profit-margin", filter],
    queryFn: () => getProfitMarginReport(filter),
    select: (data) => data?.data ?? data,
  });
};

export const useGetCustomerDueAgingReport = (
  filter: any = {},
) => {
  return useQuery({
    queryKey: ["reports", "sales", "due-aging", filter],
    queryFn: () => getDueAgingReport(filter),
    select: (data) => data?.data ?? data,
  });
};

export const useGetDiscountsReport = (
  filter: any = {},
) => {
  return useQuery({
    queryKey: ["reports", "sales", "discounts", filter],
    queryFn: () => getDiscountsReport(filter),
    select: (data) => data?.data ?? data,
  });
};


export const useGetDeadStockReport = (
  filter: any = {},
) => {
  return useQuery({
    queryKey: ["reports", "sales", "dead-stock", filter],
    queryFn: () => getDeadStockReport(filter),
    select: (data) => data?.data ?? data,
  });
};


// New Reports API's
export const useGetSalesReport = (filters?:any, queryOptions?:any) =>{
  return useQuery<any>({
    queryKey: ["sales-report", filters],
    queryFn: () => getSalesReport(filters),
    placeholderData: keepPreviousData,
    ...queryOptions
  })
};

export const useGetBestSellingProducts = (filters?: any, queryOptions?: any) => {
  return useQuery<any>({
    queryKey: ["reports", "sales", "best-selling", filters],
    queryFn: () => getBestSellingProducts(filters),
      placeholderData: keepPreviousData,
    ...queryOptions,
  });
};


// purchases
export const useGetPurhcaseReport = (filter:any, queryOptions?:any)=>{
  return useQuery<any>({
    queryKey: ["purchase-report", filter],
    queryFn: () => getPurchaseReport(filter),
    placeholderData: keepPreviousData,
    ...queryOptions,
  })
}


// inventory

export const useGetInventoryReport = (filter:any, queryOptions?:any)=>{
  return useQuery<any>({
    queryKey: ["inventory-report", filter],
    queryFn: () => getInventoryReport(filter),
    placeholderData: keepPreviousData,
    ...queryOptions,
  })
}