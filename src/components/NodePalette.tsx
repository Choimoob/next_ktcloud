import { Plus } from 'lucide-react';

interface NodePaletteProps {
  onAddNode: (nodeData: any) => void;
}

const nodeTemplates = [
  // 콘솔 (FE + User)
  {
    category: '콘솔 (Console)',
    color: 'bg-blue-100 border-blue-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '사용자 액션',
          section: 'console',
          icon: '👤',
        },
      },
      {
        type: 'process',
        data: {
          label: 'FE 처리',
          section: 'console',
          icon: '💻',
        },
      },
    ],
  },
  // API 직접 호출
  {
    category: 'API 호출',
    color: 'bg-cyan-100 border-cyan-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: 'API 직접 호출',
          section: 'api-direct',
          icon: '📡',
        },
      },
    ],
  },
  // NEXT 플랫폼
  {
    category: 'NEXT 플랫폼',
    color: 'bg-green-100 border-green-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: 'NEXT API',
          section: 'next-platform',
          icon: '🔌',
        },
      },
      {
        type: 'process',
        data: {
          label: 'NEXT 비즈니스 로직',
          section: 'next-platform',
          icon: '⚙️',
        },
      },
      {
        type: 'process',
        data: {
          label: 'NEXT 후처리',
          section: 'next-platform',
          icon: '🔄',
        },
      },
    ],
  },
  // 빌링 플랫폼
  {
    category: '빌링 플랫폼',
    color: 'bg-purple-100 border-purple-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '과금 시작',
          section: 'billing-platform',
          icon: '💰',
        },
      },
      {
        type: 'process',
        data: {
          label: '과금 종료',
          section: 'billing-platform',
          icon: '💸',
        },
      },
      {
        type: 'process',
        data: {
          label: '빌링 처리',
          section: 'billing-platform',
          icon: '💳',
        },
      },
    ],
  },
  // OpenStack
  {
    category: 'OpenStack',
    color: 'bg-orange-100 border-orange-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: 'OpenStack 작업',
          section: 'openstack',
          icon: '☁️',
        },
      },
      {
        type: 'process',
        data: {
          label: 'OpenStack 상태 확인',
          section: 'openstack',
          icon: '🔍',
        },
      },
    ],
  },
  // 실패/에러
  {
    category: '실패 / 에러',
    color: 'bg-red-100 border-red-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '에러 처리',
          section: 'fail',
          icon: '❌',
        },
      },
      {
        type: 'process',
        data: {
          label: '롤백',
          section: 'fail',
          icon: '↩️',
        },
      },
    ],
  },
  // 특수 노드
  {
    category: '특수 노드',
    color: 'bg-yellow-100 border-yellow-500',
    nodes: [
      {
        type: 'decision',
        data: {
          label: '검증/분기',
          section: 'next-platform',
        },
      },
      {
        type: 'note',
        data: {
          label: '중요 노트',
          content: '여기에 상세 설명을 입력하세요.',
        },
      },
    ],
  },
  // 그룹/섹션
  {
    category: '그룹 / 섹션',
    color: 'bg-gray-100 border-gray-400',
    nodes: [
      {
        type: 'group',
        data: {
          label: '그룹 영역',
          color: 'lightblue',
        },
      },
    ],
  },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-300 p-4 overflow-y-auto h-[800px]">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        노드 추가
      </h3>
      
      <div className="space-y-4">
        {nodeTemplates.map((template, idx) => (
          <div key={idx}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {template.category}
            </h4>
            <div className="space-y-2">
              {template.nodes.map((node, nodeIdx) => (
                <button
                  key={nodeIdx}
                  onClick={() => onAddNode(node)}
                  className={`w-full p-3 rounded-lg border-2 ${template.color} hover:shadow-md transition-all text-left text-sm font-medium`}
                >
                  {node.data.icon && <span className="mr-2">{node.data.icon}</span>}
                  {node.data.label}
                  {node.type === 'decision' && ' 🔷'}
                  {node.type === 'note' && ' 📝'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <p className="font-semibold mb-1">💡 사용법</p>
        <ul className="space-y-1">
          <li>• 버튼 클릭으로 노드 추가</li>
          <li>• 노드 클릭하여 선택</li>
          <li>• 우측 패널에서 편집</li>
          <li>• Delete 키로 삭제</li>
          <li>• 드래그로 연결</li>
        </ul>
      </div>
    </div>
  );
}