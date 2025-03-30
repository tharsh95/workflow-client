import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWorkflow } from "../contexts/WorkflowContext";
import WorkflowTable from "../components/WorkflowTable";
import axios from "axios";

// Define API URL
const API_URL = import.meta.env.VITE_API_URL;


const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [executionStatus, setExecutionStatus] = useState({});
  const { currentUser, logout } = useAuth();
  const {
    workflows,
    loading,
    error,
    pagination,
    fetchWorkflows,
    deleteWorkflow,
  } = useWorkflow();

  // Filter workflows based on search query
  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewWorkflow = () => {
    navigate("/workflow/new");
  };

  const handleEdit = (id) => {
    navigate(`/workflow/${id}/edit`);
  };

  const handleDelete = (id) => {
    deleteWorkflow(id);
  };

  const handleExecute = async (id) => {
    try {
      // Set loading state
      setExecutionStatus(prev => ({
        ...prev,
        [id]: { status: 'loading' }
      }));
      
      // Call API
      const { data } = await axios.post(`${API_URL}/workflows/${id}/execute`);
      console.log('Execution response:', data);
      
      // Set success state
      setExecutionStatus(prev => ({
        ...prev,
        [id]: { 
          status: data.success ? 'success' : 'error',
          message: data.message || (data.success ? 'Executed successfully' : 'Execution failed')
        }
      }));
      
      // Refresh workflow list if execution was successful
      if (data.success) {
        await fetchWorkflows(pagination.currentPage);
      }
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setExecutionStatus(prev => {
          const newState = {...prev};
          delete newState[id];
          return newState;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Execution error:', error);
      
      // Set error state
      setExecutionStatus(prev => ({
        ...prev,
        [id]: { 
          status: 'error',
          message: error.response?.data?.message || error.message || 'Execution failed'
        }
      }));
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        setExecutionStatus(prev => {
          const newState = {...prev};
          delete newState[id];
          return newState;
        });
      }, 3000);
    }
  };

  const handleSave = (id) => {
    // TODO: Implement workflow saving/bookmarking functionality
    console.log("Saving workflow:", id);
  };

  const handlePageChange = (page) => {
    
    // Convert to number in case it's a string
    page = parseInt(page) || 1;
    
    // Force page to be at least 1
    if (page < 1) page = 1;
    
    // Fetch workflows for the new page
    fetchWorkflows(page);
  };

  // Pagination debugging
  

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdfbf7" }}>
      {/* Main content */}
      <main className="py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome user and Sign out */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center">
                <button
                  className="p-2 mr-2 rounded-md hover:bg-gray-200"
                  title="Menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              {currentUser && (
                <p className="text-gray-600">
                  Welcome back, {currentUser.name || currentUser.email}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Display error message if there's an API error */}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Search and new workflow button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search workflows"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {(!loading && filteredWorkflows.length > 0) ||
            (loading && workflows.length > 0) ? (
              <button
                type="button"
                onClick={handleNewWorkflow}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Workflow
              </button>
            ) : null}
          </div>

          {/* Workflows table */}
          <WorkflowTable
            workflows={filteredWorkflows}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExecute={handleExecute}
            onSave={handleSave}
            executionStatus={executionStatus}
          />

          {/* Empty state - when search has no results */}
          {!loading &&
            filteredWorkflows.length === 0 &&
            searchQuery &&
            workflows.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  No workflows match your search criteria. Try adjusting your
                  search.
                </p>
              </div>
            )}

          {/* Empty state - when no workflows and not loading */}
          {!loading && workflows.length === 0 && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleNewWorkflow}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Workflow
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
