import { memo } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';

interface ProcessNodeData {
  label: string;
  section: 'console' | 'api-direct' | 'next-platform' | 'billing-platform' | 'openstack' | 'fail';
  icon?: string;
  auditLog?: string;
  auditStatus?: string;
  billing?: string;
  billingIcon?: string;
  status?: string;
  note?: string;
}

const sectionColors = {
  'console': 'bg-blue-100 border-blue-500',
  'api-direct': 'bg-cyan-100 border-cyan-500',
  'next-platform': 'bg-green-100 border-green-500',
  'billing-platform': 'bg-purple-100 border-purple-500',
  'openstack': 'bg-orange-100 border-orange-500',
  'fail': 'bg-red-100 border-red-500',
};

export const ProcessNode = memo(({ data, selected }: NodeProps<ProcessNodeData>) => {
  const colorClass = sectionColors[data.section] || 'bg-gray-100 border-gray-500';

  return (
    <>
      <NodeResizer 
        minWidth={220}
        minHeight={100}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="w-3 h-3 bg-blue-500 rounded-sm"
      />
      <div className={`px-4 py-3 rounded-lg border-2 ${colorClass} shadow-md w-full h-full overflow-auto`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        <Handle type="target" position={Position.Left} className="w-3 h-3" />
        <Handle type="target" position={Position.Right} className="w-3 h-3" />
        
        <div className="space-y-2">
          {/* Main Label */}
          <div className="flex items-center gap-2">
            {data.icon && <span className="text-xl">{data.icon}</span>}
            <div className="font-semibold text-sm">{data.label}</div>
          </div>

          {/* Status */}
          {data.status && (
            <div className="text-xs text-gray-700 bg-white/60 px-2 py-1 rounded">
              {data.status}
            </div>
          )}

          {/* Audit Log Tag */}
          {data.auditLog && (
            <div className="flex items-start gap-1 text-xs bg-sky-50 border border-sky-300 px-2 py-1 rounded">
              <span>📝</span>
              <div>
                <div className="font-medium text-sky-800">{data.auditLog}</div>
                {data.auditStatus && (
                  <div className="text-sky-600">Status: {data.auditStatus}</div>
                )}
              </div>
            </div>
          )}

          {/* Billing Tag */}
          {data.billing && (
            <div className="flex items-start gap-1 text-xs bg-amber-50 border border-amber-400 px-2 py-1 rounded">
              <span>{data.billingIcon || '💰'}</span>
              <div className="font-medium text-amber-800">{data.billing}</div>
            </div>
          )}

          {/* Note */}
          {data.note && (
            <div className="text-xs italic text-gray-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-300">
              ℹ️ {data.note}
            </div>
          )}
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
        <Handle type="source" position={Position.Left} className="w-3 h-3" />
        <Handle type="source" position={Position.Right} className="w-3 h-3" />
      </div>
    </>
  );
});

ProcessNode.displayName = 'ProcessNode';