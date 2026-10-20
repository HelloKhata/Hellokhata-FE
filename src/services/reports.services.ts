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



// Reports New

// sales
export const getSalesReport = async( filters?:any) =>{
  const res = await client.get("/api/reports-new/sales-report", { params: filters });
  return res.data;
};

export const getBestSellingProducts = async(filters?:any) =>{
  const res = await client.get("/api/reports-new/best-selling-products", { params: filters });
  return res.data;
};


// purchase
export const getPurchaseReport = async( filters?:any) =>{
  const res = await client.get("/api/reports-new/purchase-report", { params: filters });
  return res.data;
};

// inventory
export const getInventoryReport = async(filters:any) => {
  const res = await client.get("/api/reports-new/stock-report", { params: filters });
  return res.data;
};

// customer
export const getCustomerReport = async(filters:any) => {
  const res = await client.get("/api/reports-new/customer-report", { params: filters });
  return res.data;
}

// supplier
export const getSupplierReport = async(filters:any) => {
  const res = await client.get("/api/reports-new/supplier-report", { params: filters });
  return res.data;
};

// expense
export const getExpenseReport = async(filters?: any) => {
  const res = await client.get("/api/reports-new/expense-report", { params: filters });
  return res.data;
};

// income
export const getIncomeReport = async(filters?: any) => {
  const res = await client.get("/api/reports-new/income-report", { params: filters });
  return res.data;
};