import { getDashboardStats } from "@/services/dashboard.services"
import { useQuery } from "@tanstack/react-query"

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
        
    })
}