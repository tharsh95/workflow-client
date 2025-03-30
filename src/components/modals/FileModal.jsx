import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function FileModal({ isOpen, onClose, onSave, workflowToEdit }) {
  const [formData, setFormData] = useState({
    title: workflowToEdit?.metadata?.title || "",
    description: workflowToEdit?.metadata?.description || "",
  });
  const [errors, setErrors] = useState({
    title: "",
  });

  useEffect(() => {
    if (isOpen && workflowToEdit && workflowToEdit.metadata) {
      setFormData({
        title: workflowToEdit.metadata.title || "",
        description: workflowToEdit.metadata.description || "",
      });
      setErrors({ title: "" });
    }
  }, [isOpen, workflowToEdit]);

  const validateForm = () => {
    const newErrors = { title: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div
      className="fixed top-0 right-0 h-screen w-96 z-50"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="h-full bg-white border-l border-gray-200 shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Workflow Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              placeholder="Enter workflow title"
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter workflow description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-32"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileModal; 