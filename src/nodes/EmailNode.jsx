import { useState, useCallback, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function EmailNode({ id, data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState(data.email || '');

  const { setNodes, setEdges } = useReactFlow();

  // Synchronize email state with data prop when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setEmail(data.email || '');
    }
  }, [isModalOpen, data.email]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, setNodes, setEdges]);

  const handleSave = () => {
    // Log to debug
    
    
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                email: email,
              },
            }
          : node
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className="min-w-[200px] bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <span className="font-medium">{data.label}</span>
          <button 
            className="p-1 hover:bg-gray-100 rounded"
            onClick={handleDelete}
          >
            <TrashIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-3">
          <div className="text-sm text-gray-600">
            {data.email || 'No email set'}
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400"
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Configure Email</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 