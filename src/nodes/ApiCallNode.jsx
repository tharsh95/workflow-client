import { useState, useCallback, useEffect } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';


const methods = ['GET', 'POST', 'PUT', 'DELETE'];

export function APICallNode({ id, data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    method: data.method || 'GET',
    url: data.url || '',
    headers: data.headers || '',
    body: data.body || '',
  });

  const { setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    if (isModalOpen) {
      console.log('Opening API Call node modal with data:', data);
      setFormData({
        method: data.method || 'GET',
        url: data.url || '',
        headers: data.headers || '',
        body: data.body || '',
      });
    }
  }, [isModalOpen, data]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, setNodes, setEdges]);

  const handleSave = (e) => {
    e.preventDefault();
    
    // Log the form data for debugging
    console.log('Saving API Call node with data:', formData);
    
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: node.data.label,
                method: formData.method,
                url: formData.url,
                headers: formData.headers,
                body: formData.body,
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
            {data.method || 'GET'}: {data.url || 'No URL set'}
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
              <h3 className="text-lg font-semibold">Configure API Call</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <form onSubmit={handleSave}>
                <div className="flex space-x-3">
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Method
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {methods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://api.example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headers
                  </label>
                  <input
                    type="text"
                    value={formData.headers}
                    onChange={(e) => setFormData(prev => ({ ...prev, headers: e.target.value }))}
                    placeholder="Content-Type: application/json"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                {(formData.method === 'POST' || formData.method === 'PUT') && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body
                    </label>
                    <textarea
                      value={formData.body}
                      onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="{ 'key': 'value' }"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    />
                  </div>
                )}

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