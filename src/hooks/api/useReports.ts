import {
  getSalesReportSummary,
  getWhatDroveSales,
  getProfitMarginReport,
  getDueAgingReport,
  getDiscountsReport,
  getDeadStockReport,
} from "@/services/reports.services";
import { useQuery } from "@tanstack/react-query";

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