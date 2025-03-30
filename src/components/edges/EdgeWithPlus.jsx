import { PlusCircleIcon } from "@heroicons/react/24/outline";

const EdgeWithPlus = ({ id, sourceX, sourceY, targetX, targetY, setSelectedEdge, setIsAddNodeModalOpen }) => {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={`M ${sourceX},${sourceY} L ${targetX},${targetY}`}
        strokeWidth={2}
        stroke="#b1b1b7"
      />
      <foreignObject
        width={20}
        height={20}
        x={midX - 10}
        y={midY - 10}
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEdge(id);
          setIsAddNodeModalOpen(true);
        }}
      >
        <PlusCircleIcon className="w-5 h-5 text-blue-500 hover:text-blue-600" />
      </foreignObject>
    </>
  );
};

export default EdgeWithPlus; 