import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NodePaletteProps {
  onAddNode: (nodeData: any) => void;
}

const nodeTemplates = [
  // 1. 사용자 액션
  {
    category: '👤 사용자 액션',
    color: 'bg-blue-100 border-blue-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '👤 사용자 요청',
          section: 'user-action',
          icon: '🚀',
          description: '사용자 액션'
        },
      },
      {
        type: 'process',
        data: {
          label: '👤 사용자 입력',
          section: 'user-action',
          icon: '✍️',
          description: '사용자 입력'
        },
      },
    ],
  },

  // 2. 비즈니스 로직
  {
    category: '⚙️ 비즈니스 로직',
    color: 'bg-green-100 border-green-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '⚙️ 비즈니스 처리',
          section: 'business-logic',
          icon: '🔧',
          description: 'NEXT 플랫폼 로직'
        },
      },
      {
        type: 'process',
        data: {
          label: '🔐 인증 처리',
          section: 'business-logic',
          icon: '✅',
          description: '인증/권한 확인'
        },
      },
      {
        type: 'process',
        data: {
          label: '📁 리소스 생성',
          section: 'business-logic',
          icon: '✨',
          description: '리소스 생성/관리'
        },
      },
      {
        type: 'process',
        data: {
          label: '↩️ 롤백 처리',
          section: 'business-logic',
          icon: '🔄',
          description: '실패 시 롤백'
        },
      },
    ],
  },

  // 3. 빌링 로직
  {
    category: '💰 빌링 로직',
    color: 'bg-purple-100 border-purple-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '💰 과금 시작',
          section: 'billing-logic',
          icon: '▶️',
          description: '빌링 시작'
        },
      },
      {
        type: 'process',
        data: {
          label: '💰 빌링 처리',
          section: 'billing-logic',
          icon: '💳',
          description: '과금 진행 중'
        },
      },
      {
        type: 'process',
        data: {
          label: '💰 과금 종료',
          section: 'billing-logic',
          icon: '⏹️',
          description: '빌링 종료'
        },
      },
      {
        type: 'process',
        data: {
          label: '💳 최종 정산',
          section: 'billing-logic',
          icon: '🧾',
          description: '사용료 계산'
        },
      },
    ],
  },

  // 4. 실패/에러
  {
    category: '❌ 실패 / 에러',
    color: 'bg-red-100 border-red-500',
    nodes: [
      {
        type: 'process',
        data: {
          label: '❌ 에러 발생',
          section: 'error',
          icon: '🚫',
          description: '실패 처리'
        },
      },
      {
        type: 'process',
        data: {
          label: '❌ 검증 실패',
          section: 'error',
          icon: '⚠️',
          description: '유효성 검증 실패'
        },
      },
      {
        type: 'process',
        data: {
          label: '❌ 시스템 오류',
          section: 'error',
          icon: '💥',
          description: '시스템 에러'
        },
      },
    ],
  },

  // 5. 특수 노드 - 검증/분기
  {
    category: '🔷 검증 / 분기',
    color: 'bg-yellow-100 border-yellow-500',
    nodes: [
      {
        type: 'decision',
        data: {
          label: '검증/분기',
          description: '조건 분기',
          yesLabel: '성공',
          noLabel: '실패'
        },
      },
      {
        type: 'decision',
        data: {
          label: '상태 확인',
          description: 'ACTIVE?',
          yesLabel: 'ACTIVE',
          noLabel: 'ERROR'
        },
      },
    ],
  },

  // 6. 중요 노트
  {
    category: '📝 중요 노트',
    color: 'bg-orange-100 border-orange-500',
    nodes: [
      {
        type: 'note',
        data: {
          label: '📝 감사 로그',
          description: '이벤트 기록',
          emoji: '📊'
        },
      },
      {
        type: 'note',
        data: {
          label: '⚠️ 중요 정책',
          description: '비즈니스 룰',
          emoji: '💡'
        },
      },
      {
        type: 'note',
        data: {
          label: '💰 과금 정책',
          description: '빌링 관련 주의사항',
          emoji: '💰'
        },
      },
    ],
  },

  // 7. 그룹 영역
  {
    category: '📦 그룹 영역',
    color: 'bg-gray-100 border-gray-400',
    nodes: [
      {
        type: 'group',
        data: {
          label: '그룹 영역',
          description: '여러 노드를 묶는 그룹'
        },
      },
    ],
  },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-300 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all shadow-sm hover:shadow-md"
          title="노드 팔레트 열기"
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
        </button>
        <div className="mt-4 text-xs text-gray-500 font-semibold transform rotate-90 whitespace-nowrap">
          노드 추가
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white border-r border-gray-300 overflow-y-auto flex-shrink-0" style={{ height: 'calc(100vh - 180px)' }}>
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <h3 className="font-bold text-lg flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-5 h-5" />
          노드 추가
        </h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-all hover:shadow-md flex-shrink-0"
          title="패널 접기"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 hover:text-blue-600" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {nodeTemplates.map((template, idx) => (
          <div key={idx}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
              {template.category}
            </h4>
            <div className="space-y-2">
              {template.nodes.map((node, nodeIdx) => (
                <button
                  key={nodeIdx}
                  onClick={() => onAddNode(node)}
                  className={`w-full p-3 rounded-lg border-2 ${template.color} hover:shadow-md transition-all text-left text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis`}
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

      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 mx-4 mb-4">
        <p className="font-semibold mb-2 text-blue-600 whitespace-nowrap">💡 사용법</p>
        <ul className="space-y-1.5">
          <li className="whitespace-nowrap"><strong>노드 추가:</strong> 버튼 클릭</li>
          <li className="whitespace-nowrap"><strong>노드 편집:</strong> 우측 패널에서 수정</li>
          <li className="whitespace-nowrap"><strong>노드 연결:</strong> 핸들을 드래그</li>
        </ul>
        
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="font-semibold mb-2 text-green-600 whitespace-nowrap">🎯 선택 & 정렬</p>
          <ul className="space-y-1.5">
            <li>• <strong>Shift + 드래그:</strong> 박스 선택</li>
            <li>• <strong>Ctrl/Cmd + 클릭:</strong> 다중 선택</li>
            <li>• <strong>Shift + 이동:</strong> 정렬 가이드</li>
            <li>• <strong>2개 이상 선택:</strong> 정렬 툴바 표시</li>
          </ul>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="font-semibold mb-2 text-red-600 whitespace-nowrap">⌨️ 단축키</p>
          <ul className="space-y-1.5">
            <li className="whitespace-nowrap">• <strong>Delete/Backspace:</strong> 삭제</li>
            <li className="whitespace-nowrap">• <strong>Ctrl+Z:</strong> 되돌리기</li>
            <li className="whitespace-nowrap">• <strong>Ctrl+Y:</strong> 다시 실행</li>
            <li className="whitespace-nowrap">• <strong>Ctrl+S:</strong> JSON 저장</li>
          </ul>
        </div>
      </div>
    </div>
  );
}