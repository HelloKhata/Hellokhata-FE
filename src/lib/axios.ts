
import axios from "axios";
import { toast } from "sonner";

const client = axios.create({
  baseURL: 'https://voiceerp.mapleitfirm.com',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = []

const processQueue = (error:any, success = false) => {
  failedQueue.forEach(prom => {
    if(success) prom.resolve();
    else prom.reject(error);
  });

  failedQueue = [];
}
client.interceptors.response.use(
  (res) => res,
  async(error) => {
    // console.log(error.response.data)
    const originalRequest = error.config;
    const message = error.response?.data?.message || "Something went wrong!";
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if(isRefreshing){
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject})
        })
        .then(() => client(originalRequest))
        .catch(err => Promise.reject(err))
      }

       isRefreshing = true;

      try{
        await axios.post(
          'https://voiceerp.mapleitfirm.com/api/auth/refresh',
           {},
            { withCredentials: true }
          );
          processQueue(null,true);

          return client(originalRequest);
      }
      catch(refreshError){
          processQueue(refreshError, false);
          if (typeof window !== "undefined") {
            toast.error("Session expired. Please login again.");

        const pathname = window.location.pathname;

        if ((pathname !== "/login") && (pathname !== "/verify-forget-otp")) {
          window.location.href = "/login";
        }
      }
       return Promise.reject(refreshError);
      }
      finally{
        isRefreshing = false;
      }
    }

    toast.error(message);
    return Promise.reject(error);
  },
);
export default client;