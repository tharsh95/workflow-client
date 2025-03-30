import { Handle, Position } from 'reactflow';

export function EndNode() {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-600"
      />
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-2 border-red-600" />
        {/* Inner circle with content */}
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-medium text-sm">
          End
        </div>
      </div>
    </div>
  );
} 