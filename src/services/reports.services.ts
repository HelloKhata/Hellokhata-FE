import client from "@/lib/axios";


export const getSalesReportSummary = async (filter: any = {}) => {
  const res = await client.get("/api/reports/sales/summary", { params: filter });
  return res.data;
};


export const getWhatDroveSales = async (filter: any = {}) => {
  const res = await client.get("/api/reports/sales/what-drove-sales", { params: filter });
  return res.data;
};

export const getProfitMarginReport = async (filter: any = {}) => {
  const res = await client.get("/api/reports/sales/profit-margin", { params: filter });
  return res.data;
};

export const getDueAgingReport = async (filter: any = {}) => {
  const res = await client.get("/api/reports/sales/due-aging", { params: filter });
  return res.data;
};

export const getDiscountsReport = async (filter: any = {}) => {
  const res = await client.get("/api/reports/sales/discounts", { params: filter });
  return res.data;
};

export const getDeadStockReport = async (filter: any = {}) => {
  const res = await client.get("/api/reports/sales/dead-stock", { params: filter });
  return res.data;
};
