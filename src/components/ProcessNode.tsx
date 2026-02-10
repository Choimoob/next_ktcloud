import { memo } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';

interface ProcessNodeData {
  label: string;
  section: 'user-action' | 'business-logic' | 'billing-logic' | 'error';
  icon?: string;
  description?: string;
}

const sectionColors = {
  'user-action': 'bg-blue-100 border-blue-500',
  'business-logic': 'bg-green-100 border-green-500',
  'billing-logic': 'bg-purple-100 border-purple-500',
  'error': 'bg-red-100 border-red-500',
};

export const ProcessNode = memo(({ data, selected }: NodeProps<ProcessNodeData>) => {
  const colorClass = sectionColors[data.section] || 'bg-gray-100 border-gray-500';

  return (
    <>
      <NodeResizer 
        minWidth={180}
        minHeight={80}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="w-3 h-3 bg-blue-500 rounded-sm"
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
      
      <div className={`px-4 py-3 rounded-lg border-2 ${colorClass} shadow-md min-w-[180px] max-w-[400px] ${
        selected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
      }`}>
        <div className="space-y-2">
          {/* Main Label */}
          <div className="flex items-center gap-2">
            {data.icon && <span className="text-xl flex-shrink-0">{data.icon}</span>}
            <div className="font-semibold text-sm leading-tight">{data.label}</div>
          </div>

          {/* Description */}
          {data.description && (
            <div className="text-xs text-gray-700 bg-white/60 px-2 py-1 rounded leading-relaxed">
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

ProcessNode.displayName = 'ProcessNode';