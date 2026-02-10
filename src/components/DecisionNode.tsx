import { memo } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';

interface DecisionNodeData {
  label: string;
  description?: string;
  yesLabel?: string;
  noLabel?: string;
}

export const DecisionNode = memo(({ data, selected }: NodeProps<DecisionNodeData>) => {
  return (
    <>
      <NodeResizer 
        minWidth={160}
        minHeight={160}
        isVisible={selected}
        lineClassName="border-yellow-400"
        handleClassName="w-3 h-3 bg-yellow-500 rounded-sm"
        keepAspectRatio={true}
      />
      <div className={`relative flex items-center justify-center w-full h-full min-w-[160px] min-h-[160px] ${
        selected ? 'ring-4 ring-yellow-400 ring-opacity-50 rounded-lg' : ''
      }`}>
        {/* 4방향 입력 핸들 */}
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white hover:!scale-150 transition-transform" 
        />
        <Handle 
          type="target" 
          position={Position.Bottom} 
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white hover:!scale-150 transition-transform" 
        />
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white hover:!scale-150 transition-transform" 
        />
        <Handle 
          type="target" 
          position={Position.Right} 
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white hover:!scale-150 transition-transform" 
        />
        
        {/* Perfect Diamond shape using SVG */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid meet"
        >
          <polygon
            points="50,10 90,50 50,90 10,50"
            fill="#FEF3C7"
            stroke="#EAB308"
            strokeWidth="2"
            className="drop-shadow-md"
          />
        </svg>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 py-4 font-semibold text-sm max-w-[75%]">
          <div className="leading-tight break-words">{data.label}</div>
          {data.description && (
            <div className="text-xs text-gray-600 mt-1.5 leading-tight break-words">{data.description}</div>
          )}
        </div>

        {/* 4방향 출력 핸들 */}
        <Handle 
          type="source" 
          position={Position.Top} 
          className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
          id="top" 
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
          id="bottom" 
        />
        <Handle 
          type="source" 
          position={Position.Left} 
          className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
          id="left" 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
          id="right" 
        />
      </div>
    </>
  );
});

DecisionNode.displayName = 'DecisionNode';