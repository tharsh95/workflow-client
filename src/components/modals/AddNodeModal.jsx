import { XMarkIcon, ArrowsRightLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function AddNodeModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add Node</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => onSelect("apiCall")}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-md flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowsRightLeftIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">API Call</div>
                <div className="text-sm text-gray-500">
                  Make HTTP requests to external services
                </div>
              </div>
            </button>
            <button
              onClick={() => onSelect("email")}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-md flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <EnvelopeIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-500">
                  Send emails to recipients
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNodeModal; 