import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WorkflowEditor } from "./WorkFlowEditor";
import { useWorkflow } from "../contexts/WorkflowContext";


const WorkflowEditorWrapper = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [workflowToEdit, setWorkflowToEdit] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { fetchWorkflows } = useWorkflow();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
      const loadWorkflow = async () => {
        try {
          setIsLoading(true);
          if (id && id !== 'new') {
            // Fetch the specific workflow from API
            try {
              const token = localStorage.getItem('token'); 
              const response = await axios.get(`${API_URL}/workflows/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              
              if (response.data) {
                // Check if the API returns the workflow directly or as part of a "data" field
                const workflowData = response.data.data || response.data;
                // Ensure the workflow has the expected structure
                if (workflowData && workflowData.id === id) {
                  setWorkflowToEdit(workflowData);
                } else {
                  navigate('/dashboard');
                }
              } else {
                console.error('WorkflowEditorWrapper: Empty response when fetching workflow');
                navigate('/dashboard');
              }
            } catch (error) {
              console.error('WorkflowEditorWrapper: Error fetching workflow:', error);
              navigate('/dashboard');
            }
          } else {
            setWorkflowToEdit(undefined);
          }
        } catch (err) {
          console.error('Error loading workflow:', err);
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      };
  
      loadWorkflow();
    }, [id, navigate]);
  
    const handleSave = async (workflow) => {
      try {
        // Force refresh the workflow list before navigating away
        await fetchWorkflows(1);
        
        // Add small delay to ensure the API call completes
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      } catch (error) {
        console.error('Error in handleSave:', error, workflow.id);
        navigate('/dashboard');
      }
    };
  
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fdfbf7' }}>
        <WorkflowEditor
          workflowToEdit={workflowToEdit}
          onBack={() => navigate('/dashboard')}
          onSave={handleSave}
        />
      </div>
    );
  }
  export default WorkflowEditorWrapper;