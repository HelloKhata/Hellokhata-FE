import client from "@/lib/axios";

export const createItem = async (item: any) => {
  const res = await client.post("/api/items", item);
  return res.data;
};

export const getItems = async (params?: {
  search?: string;
  categoryId?: string;
  branchId?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}) => {
  const res = await client.get("/api/items", {
    params: {
      ...params,
      //   page: params?.page ?? 1,
      //   limit: params?.limit ?? 50,
    },
  });
  return res.data;
};

export const getSingleItem = async (id: string) => {
  const res = await client.get(`/api/items/${id}`);
  return res.data;
};

export const updateItem = async (item: any) => {
  const res = await client.patch(`/api/items/${item.id}`, item.data);
  return res.data;
};
export const deleteItem = async (id: string) => {
  const res = await client.delete(`/api/items/${id}`);
  return res.data;
};
export const getItemsCategories = async () => {
  const res = await client.get("/api/items/categories");
  return res.data;
};

export const transferItem = async (item: any) => {
  const res = await client.post("/api/items/transfer", item);
  return res.data;
};

export type ItemsStatus = {
  totalItems: number;
  totalStock: number;
  stockValue: number;
  lowStock: number;
};

export const getItemsStatus = async (): Promise<{
  success: boolean;
  data: ItemsStatus;
}> => {
  const res = await client.get("/api/items/status");
  return res.data;
};
