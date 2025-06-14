import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../services/api';
import { API_ENDPOINTS } from '../../../../constants';

// Get all complaints
export const useComplaints = () => {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.COMPLAINTS.LIST);
      return response.data.data;
    }
  });
};

// Get complaint by ID
export const useComplaint = (id) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.COMPLAINTS.DETAIL(id));
      return response.data.data;
    },
    enabled: !!id
  });
};

// Create new complaint
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(API_ENDPOINTS.COMPLAINTS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['complaints']);
    }
  });
}; 
 