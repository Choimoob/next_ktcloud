import { memo } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';

interface DecisionNodeData {
  label: string;
  section: string;
}

export const DecisionNode = memo(({ data, selected }: NodeProps<DecisionNodeData>) => {
  return (
    <>
      <NodeResizer 
        minWidth={120}
        minHeight={120}
        isVisible={selected}
        lineClassName="border-yellow-400"
        handleClassName="w-3 h-3 bg-yellow-500 rounded-sm"
      />
      <div className="relative w-full h-full flex items-center justify-center">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <Handle type="target" position={Position.Left} className="w-3 h-3" />
        <Handle type="target" position={Position.Right} className="w-3 h-3" />
        
        {/* Diamond shape */}
        <div 
          className="absolute inset-0 m-auto w-[80%] h-[80%] bg-yellow-100 border-2 border-yellow-500 shadow-md rotate-45"
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 font-semibold text-sm max-w-[70%]">
          {data.label}
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
        <Handle type="source" position={Position.Left} className="w-3 h-3" id="left" />
        <Handle type="source" position={Position.Right} className="w-3 h-3" id="right" />
      </div>
    </>
  );
});

DecisionNode.displayName = 'DecisionNode';