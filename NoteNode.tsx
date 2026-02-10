import { memo } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';

interface NoteNodeData {
  label: string;
  content: string;
}

export const NoteNode = memo(({ data, selected }: NodeProps<NoteNodeData>) => {
  return (
    <>
      <NodeResizer 
        minWidth={200}
        minHeight={100}
        isVisible={selected}
        lineClassName="border-amber-400"
        handleClassName="w-3 h-3 bg-amber-500 rounded-sm"
      />
      <div className="px-4 py-3 rounded-lg border-2 border-amber-500 bg-amber-50 shadow-lg w-full h-full overflow-auto">
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <Handle type="target" position={Position.Left} className="w-3 h-3" />
        <Handle type="target" position={Position.Right} className="w-3 h-3" />
        <Handle type="target" position={Position.Bottom} className="w-3 h-3" />
        
        <div className="space-y-2">
          <div className="font-bold text-sm text-amber-900">{data.label}</div>
          <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
            {data.content}
          </div>
        </div>

        <Handle type="source" position={Position.Top} className="w-3 h-3" />
        <Handle type="source" position={Position.Left} className="w-3 h-3" />
        <Handle type="source" position={Position.Right} className="w-3 h-3" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </div>
    </>
  );
});

NoteNode.displayName = 'NoteNode';