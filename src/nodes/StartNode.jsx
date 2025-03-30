import { Handle, Position } from 'reactflow';

export function StartNode() {
  return (
    <div className="relative">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-2 border-green-600" />
        {/* Inner circle with content */}
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-medium text-sm">
          Start
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-600"
      />
    </div>
  );
} 