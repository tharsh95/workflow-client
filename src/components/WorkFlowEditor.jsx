import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ArrowLeftIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { APICallNode } from "../nodes/ApiCallNode";
import { StartNode } from "../nodes/StartNode";
import { EndNode } from "../nodes/EndNode";
import { EmailNode } from "../nodes/EmailNode";
import FileModal from "./modals/FileModal";
import AddNodeModal from "./modals/AddNodeModal";
import EdgeWithPlus from "./edges/EdgeWithPlus";
import { initialNodes, initialEdges } from "./constants/initialData";
import axios from "axios";

// Define node types
const nodeTypes = {
  apiCall: APICallNode,
  start: StartNode,
  end: EndNode,
  email: EmailNode,
};

export function WorkflowEditor({
  workflowToEdit,
  onBack,
  onSave,
}) {

const API_URL = import.meta.env.VITE_API_URL;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Initialize from workflowToEdit when component mounts or workflowToEdit changes
  useEffect(() => {
    if (!workflowToEdit || !workflowToEdit.sequence || !workflowToEdit.metadata) {
      return;
    }

    try {
      // Start with fresh nodes
      const newNodes= [];
      const newEdges= [];

      // Add start node
      if (workflowToEdit.sequence.start && workflowToEdit.sequence.start.id) {
        newNodes.push({
          id: workflowToEdit.sequence.start.id,
          type: 'start',
          position: { x: 250, y: 50 },
          data: { label: 'Start' },
        });
      }

      // Add each step as a node
      let yPos = 200;
      if (Array.isArray(workflowToEdit.sequence.steps)) {
        workflowToEdit.sequence.steps.forEach((step) => {
          if (step && step.id && step.type) {
            newNodes.push({
              id: step.id,
              type: step.type === 'apiCall' ? 'apiCall' : 'email',
              position: { x: 250, y: yPos },
              data: {
                ...(step.config || {}),
                label: step.type === 'apiCall' ? 'API Call' : 'Email',
              },
            });
            yPos += 400;
          }
        });
      }

      // Add end node
      if (workflowToEdit.sequence.end && workflowToEdit.sequence.end.id) {
        newNodes.push({
          id: workflowToEdit.sequence.end.id,
          type: 'end',
          position: { x: 250, y: yPos },
          data: { label: 'End' },
        });
      }

      // Connect start to first step
      if (workflowToEdit.sequence.start && workflowToEdit.sequence.start.next) {
        newEdges.push({
          id: `${workflowToEdit.sequence.start.id}-${workflowToEdit.sequence.start.next}`,
          source: workflowToEdit.sequence.start.id,
          target: workflowToEdit.sequence.start.next,
        });
      }

      // Connect each step to the next
      if (Array.isArray(workflowToEdit.sequence.steps)) {
        workflowToEdit.sequence.steps.forEach((step) => {
          if (step && step.id && step.next) {
            newEdges.push({
              id: `${step.id}-${step.next}`,
              source: step.id,
              target: step.next,
            });
          }
        });
      }

      // Update the ReactFlow nodes and edges
      if (newNodes.length > 0) {
        setNodes(newNodes);
      }
      if (newEdges.length > 0) {
        setEdges(newEdges);
      }
    } catch (error) {
      console.error('WorkflowEditor: Error initializing from workflowToEdit:', error);
    }
  }, [workflowToEdit, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection) => {
      // Check if target node already has an incoming connection
      const hasIncomingConnection = edges.some(
        (edge) => edge.target === connection.target
      );
      if (hasIncomingConnection) {
        return;
      }
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges, edges]
  );

  const handleAddNode = useCallback(
    (type) => {
      if (!selectedEdge) return;

      const edge = edges.find((e) => e.id === selectedEdge);
      if (!edge) return;

      // Calculate position between source and target nodes
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (!sourceNode || !targetNode) return;

      const newNodeX = (sourceNode.position.x + targetNode.position.x) / 2;
      const newNodeY = (sourceNode.position.y + targetNode.position.y) / 2;

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position: { x: newNodeX, y: newNodeY },
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      };

      // Remove old edge and create two new edges
      setEdges((eds) =>
        eds
          .filter((e) => e.id !== selectedEdge)
          .concat([
            {
              id: `${edge.source}-${newNode.id}`,
              source: edge.source,
              target: newNode.id,
            },
            {
              id: `${newNode.id}-${edge.target}`,
              source: newNode.id,
              target: edge.target,
            },
          ])
      );

      setNodes((nds) => nds.concat(newNode));
      setSelectedEdge(null);
      setIsAddNodeModalOpen(false);
    },
    [selectedEdge, edges, nodes, setNodes, setEdges]
  );

  const handleSaveWorkflow = async (data) => {
    try {
      if (!data.title.trim()) {
        return;
      }

      // Find the start node
      const startNode = nodes.find((node) => node.type === "start");
      if (!startNode) {
        console.error("No start node found");
        return;
      }

      // Create a structured workflow sequence
      const workflowSequence = {
        id: workflowToEdit?.id || `workflow-${Date.now()}`,
        metadata: {
          title: data.title.trim(),
          description: data.description.trim(),
          createdAt:
            workflowToEdit?.metadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        sequence: {
          start: {
            id: startNode.id,
            type: "start",
            next:
              edges.find((edge) => edge.source === startNode.id)?.target || "",
          },
          steps: nodes
            .filter((node) => node.type !== "start" && node.type !== "end")
            .map((node) => ({
              id: node.id,
              type: node.type || "",
              config: {
                ...(node.type === "apiCall" && {
                  method: node.data?.method || "GET",
                  url: node.data?.url || "",
                  headers: node.data?.headers || "",
                  body: node.data?.body || "",
                }),
                ...(node.type === "email" && {
                  email: node.data?.email || "",
                }),
              },
              next: edges.find((edge) => edge.source === node.id)?.target || "",
            })),
          end: {
            id: nodes.find((node) => node.type === "end")?.id || "",
            type: "end",
          },
        },
      };

      // Save the workflow
      const token = localStorage.getItem('token');
      
      if (workflowToEdit && workflowToEdit.id) {
        // Update existing workflow
        await axios.put(
          `${API_URL}/workflows/${workflowToEdit.id}`,
          workflowSequence,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
      } else {
        // Create new workflow
        await axios.post(
          `${API_URL}/workflows`,
          workflowSequence,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
      }
      
      // Always call onSave with the workflow data
      onSave(workflowSequence);
    } catch (error) {
      console.error("Error saving workflow:", error);
      // Still call onSave to navigate back and refresh the list
      onSave({});
    }
  };

  // Create custom edge component with the necessary props
  const CustomEdgeWithPlus = useCallback(
    (props) => (
      <EdgeWithPlus
        {...props}
        setSelectedEdge={setSelectedEdge}
        setIsAddNodeModalOpen={setIsAddNodeModalOpen}
      />
    ),
    [setSelectedEdge, setIsAddNodeModalOpen]
  );

  const edgeTypes = {
    default: CustomEdgeWithPlus,
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">
            {workflowToEdit && workflowToEdit.metadata ? `Edit Workflow: ${workflowToEdit.metadata.title}` : "New Workflow"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsFileModalOpen(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <DocumentIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <AddNodeModal
        isOpen={isAddNodeModalOpen}
        onClose={() => {
          setIsAddNodeModalOpen(false);
          setSelectedEdge(null);
        }}
        onSelect={handleAddNode}
      />
      <FileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSave={(formData) => {
          handleSaveWorkflow(formData);
        }}
        workflowToEdit={workflowToEdit}
      />
      <style>
        {`
          .animated {
            animation: flowAnimation 1s ease-in-out;
          }
          @keyframes flowAnimation {
            0% {
              stroke-dasharray: 5;
              stroke-dashoffset: 20;
            }
            100% {
              stroke-dasharray: 5;
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
