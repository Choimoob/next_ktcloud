import { memo } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';

interface NoteNodeData {
  label: string;
  description?: string;
  emoji?: string;
}

export const NoteNode = memo(({ data, selected }: NodeProps<NoteNodeData>) => {
  return (
    <>
      <NodeResizer 
        minWidth={200}
        minHeight={80}
        isVisible={selected}
        lineClassName="border-orange-400"
        handleClassName="w-3 h-3 bg-orange-500 rounded-sm"
      />
      
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
      
      <div className={`px-4 py-3 rounded-lg border-2 border-orange-500 bg-orange-50 shadow-lg min-w-[200px] max-w-[500px] ${
        selected ? 'ring-4 ring-orange-400 ring-opacity-50' : ''
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {data.emoji && <span className="text-xl flex-shrink-0">{data.emoji}</span>}
            <div className="font-bold text-sm text-orange-900 leading-tight">{data.label}</div>
          </div>
          {data.description && (
            <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
              {data.description}
            </div>
          )}
        </div>
      </div>

      {/* 4방향 출력 핸들 */}
      <Handle 
        type="source" 
        position={Position.Top} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white hover:!scale-150 transition-transform" 
      />
    </>
  );
});

NoteNode.displayName = 'NoteNode';