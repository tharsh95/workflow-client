import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const WorkflowContext = createContext();

export const useWorkflow = () => {
  return useContext(WorkflowContext);
};

export const WorkflowProvider = ({ children }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Configure axios defaults when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Debug request configuration
      api.interceptors.request.use(
        config => {

          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );
    } else {

      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchWorkflows = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      
      
      // Using our api instance with baseURL
      const response = await api.get('/workflows', {
        params: { page, limit }
      });
    
      
      const data = response.data;
      
      // Process API response
      processApiResponse(data, page);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch workflows';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to process API response
  const processApiResponse = (data, currentPage = 1) => {
    // Check if data has the expected structure
    if (!data) {
      console.error('Unexpected API response format: empty data');
      throw new Error('Received empty data from the API');
    }
    
    
    
    // Handle different possible data structures
    let workflowItems = [];
    if (data.data && Array.isArray(data.data)) {
      workflowItems = data.data;
    } else if (Array.isArray(data)) {
      workflowItems = data;
    } else {
      console.error('Could not find workflows array in response:', data);
      throw new Error('Invalid API response format');
    }
    
    console.log(workflowItems)
    
    // Transform API data to match our expected format
    const transformedWorkflows = workflowItems.map(workflow => {
      try {
        return {
          id: workflow.id,
          name: workflow.metadata?.title || 'Untitled',
          lastUpdated: workflow.metadata?.updatedAt 
            ? new Date(workflow.metadata.updatedAt).toLocaleDateString() 
            : 'Unknown date',
          description: workflow.metadata?.description || 'No description provided',
          steps: workflow.sequence?.steps?.length || 0,
          count: workflow.count || 0
        };
      } catch (e) {
        console.error('Error transforming workflow:', workflow, e);
        return {
          id: workflow.id || 'unknown-id',
          name: 'Error parsing workflow',
          lastUpdated: 'Unknown',
          description: 'There was an error parsing this workflow data',
          steps: 0
        };
      }
    });
    
    
    setWorkflows(transformedWorkflows);
    
    // Extract pagination information from the API response
    let totalPages = 1;
    
    // Try different ways the API might return total pages
    if (typeof data.totalPages === 'number') {
      totalPages = data.totalPages;
    } else if (typeof data.total_pages === 'number') {
      totalPages = data.total_pages;
    } else if (data.pagination && typeof data.pagination.totalPages === 'number') {
      totalPages = data.pagination.totalPages;
    } else {
      // If we can't find total pages, calculate based on total count and limit
      const totalCount = data.totalCount || data.total_count || (data.pagination && data.pagination.totalCount) || workflowItems.length;
      const limit = 10; // Assuming default limit is 10
      totalPages = Math.ceil(totalCount / limit);
    }
    
    // Ensure totalPages is at least 1
    if (totalPages < 1) totalPages = 1;
    
    // If we have more than one page of results, ensure totalPages is at least 2
    if (workflowItems.length > 0 && (data.pagination?.hasNextPage || data.pagination?.hasPrevPage)) {
      totalPages = Math.max(2, totalPages);
    }
    
    const paginationData = {
      currentPage: data.currentPage || currentPage,
      totalPages: totalPages,
      totalCount: data.totalCount || workflowItems.length,
      hasNextPage: Boolean(data.pagination?.hasNextPage),
      hasPrevPage: Boolean(data.pagination?.hasPrevPage),
      // Add raw data for debugging
      _raw: {
        responseCurrentPage: data.currentPage,
        responseTotalPages: data.totalPages,
        calculatedTotalPages: totalPages
      }
    };
    
    
    setPagination(paginationData);
  };

  const createWorkflow = async (workflowData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      await api.post('/workflows', workflowData);
      
      // Refresh the list
      await fetchWorkflows(pagination.currentPage);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create workflow';
      setError(errorMessage);
      console.error('Error creating workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkflow = async (id, workflowData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      await api.put(`/workflows/${id}`, workflowData);
      
      // Refresh the list
      await fetchWorkflows(pagination.currentPage);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update workflow';
      setError(errorMessage);
      console.error('Error updating workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkflow = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      await api.delete(`/workflows/${id}`);
      
      // Refresh the list after deletion
      await fetchWorkflows(pagination.currentPage);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete workflow';
      setError(errorMessage);
      console.error('Error deleting workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkflows();
    }
  }, [token]);

  const value = {
    workflows,
    loading,
    error,
    pagination,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext; 