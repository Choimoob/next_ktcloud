import { memo } from 'react';
import { type NodeProps, NodeResizer } from '@xyflow/react';

interface GroupNodeData {
  label: string;
  color?: string;
}

const colorOptions = {
  'lightblue': 'bg-blue-50 border-blue-200',
  'lightgreen': 'bg-green-50 border-green-200',
  'lightpurple': 'bg-purple-50 border-purple-200',
  'lightpink': 'bg-pink-50 border-pink-200',
  'lightyellow': 'bg-yellow-50 border-yellow-200',
  'lightgray': 'bg-gray-50 border-gray-200',
  'lightcyan': 'bg-cyan-50 border-cyan-200',
  'lightindigo': 'bg-indigo-50 border-indigo-200',
};

export const GroupNode = memo(({ data, selected }: NodeProps<GroupNodeData>) => {
  const colorClass = data.color && colorOptions[data.color as keyof typeof colorOptions] 
    ? colorOptions[data.color as keyof typeof colorOptions]
    : 'bg-gray-50 border-gray-200';

  return (
    <>
      <NodeResizer 
        minWidth={300}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-gray-400"
        handleClassName="w-3 h-3 bg-gray-500 rounded-sm"
      />
      <div className={`${colorClass} border-2 border-dashed rounded-xl p-4 w-full h-full`}>
        <div className="font-semibold text-sm text-gray-700 mb-2 bg-white/80 px-3 py-1 rounded-md inline-block shadow-sm">
          📦 {data.label}
        </div>
      </div>
    </>
  );
});

GroupNode.displayName = 'GroupNode';