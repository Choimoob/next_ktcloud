import { useState, useEffect } from 'react';
import type { Node } from '@xyflow/react';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: any | null;
  onUpdateNode: (nodeId: string, newData: any) => void;
  onUpdateEdge: (edgeId: string, newData: any) => void;
}

export function PropertiesPanel({ selectedNode, selectedEdge, onUpdateNode, onUpdateEdge }: PropertiesPanelProps) {
  const [formData, setFormData] = useState<any>({});
  const [edgeFormData, setEdgeFormData] = useState<any>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data);
    }
  }, [selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeFormData({
        label: selectedEdge.label || '',
        animated: selectedEdge.animated || false,
        type: selectedEdge.type || 'default',
        style: selectedEdge.style || {},
      });
    }
  }, [selectedEdge]);

  // Collapsed state
  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-300 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 bg-green-100 hover:bg-green-200 rounded-lg transition-all shadow-sm hover:shadow-md"
          title="속성 패널 열기"
        >
          <ChevronLeft className="w-6 h-6 text-green-600" />
        </button>
        <div className="mt-4 text-xs text-gray-500 font-semibold transform rotate-90 whitespace-nowrap">
          속성 편집
        </div>
      </div>
    );
  }

  // No selection
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-white border-l border-gray-300" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            속성 편집
          </h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 bg-gray-100 hover:bg-green-100 rounded-lg transition-all hover:shadow-md"
            title="패널 접기"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 hover:text-green-600" />
          </button>
        </div>
        <div className="p-4 flex items-center justify-center text-gray-400 h-[calc(100%-60px)]">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>노드 또는 선을 선택하세요</p>
          </div>
        </div>
      </div>
    );
  }

  // Edge selected
  if (selectedEdge && !selectedNode) {
    const handleEdgeChange = (field: string, value: any) => {
      const newData = { ...edgeFormData, [field]: value };
      setEdgeFormData(newData);
      onUpdateEdge(selectedEdge.id, newData);
    };

    return (
      <div className="w-80 bg-white border-l border-gray-300" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            선(엣지) 편집
          </h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 bg-gray-100 hover:bg-green-100 rounded-lg transition-all hover:shadow-md"
            title="패널 접기"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 hover:text-green-600" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          <div className="space-y-4">
            {/* Edge Label */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                레이블 (선 위 텍스트)
              </label>
              <input
                type="text"
                value={edgeFormData.label || ''}
                onChange={(e) => handleEdgeChange('label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 성공, 실패, ACTIVE"
              />
            </div>

            {/* Edge Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                선 타입
              </label>
              <select
                value={edgeFormData.type || 'default'}
                onChange={(e) => handleEdgeChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">기본 (직선)</option>
                <option value="straight">완전 직선</option>
                <option value="step">계단형</option>
                <option value="smoothstep">부드러운 계단형</option>
              </select>
            </div>

            {/* Animated */}
            <div className="border-t pt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                애니메이션 (플로우 진행)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdgeChange('animated', true)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    edgeFormData.animated
                      ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold mb-1">✅ 활성</div>
                  <div className="text-xs opacity-90">움직이는 점선</div>
                </button>
                <button
                  onClick={() => handleEdgeChange('animated', false)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    !edgeFormData.animated
                      ? 'bg-gray-500 border-gray-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold mb-1">⏸️ 비활성</div>
                  <div className="text-xs opacity-90">일반 실선</div>
                </button>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-600">
                <p><strong className="text-blue-600">활성:</strong> Happy Path, 주요 플로우</p>
                <p className="mt-1"><strong className="text-gray-600">비활성:</strong> 보조 플로우, 에러 경로</p>
              </div>
            </div>

            {/* Edge Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <p><strong>Edge ID:</strong> {selectedEdge.id}</p>
              <p className="mt-1"><strong>From:</strong> {selectedEdge.source}</p>
              <p className="mt-1"><strong>To:</strong> {selectedEdge.target}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Node selected
  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdateNode(selectedNode!.id, newData);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-300" style={{ height: 'calc(100vh - 180px)' }}>
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          속성 편집
        </h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 bg-gray-100 hover:bg-green-100 rounded-lg transition-all hover:shadow-md"
          title="패널 접기"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 hover:text-green-600" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        <div className="space-y-4">
          {/* Node Type Badge */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              노드 타입
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded text-sm font-medium">
              {selectedNode.type === 'process' && '🔹 프로세스'}
              {selectedNode.type === 'decision' && '🔷 결정/분기'}
              {selectedNode.type === 'note' && '📝 노트'}
              {selectedNode.type === 'group' && '📦 그룹/섹션'}
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              레이블 *
            </label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="노드 이름"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              설명
            </label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="노드 설명"
            />
          </div>

          {/* Group Node Settings */}
          {selectedNode.type === 'group' && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                📦 그룹 설정
              </h4>
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                💡 그룹 노드는 다른 노드들을 감싸는 배경 역할을 합니다. 드래그하여 크기를 조절하세요.
              </div>
            </div>
          )}

          {/* Process Node Settings */}
          {selectedNode.type === 'process' && (
            <>
              {/* Icon */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  아이콘 (이모지)
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 🔌"
                  maxLength={2}
                />
              </div>

              {/* Section (Category) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  카테고리 (색상)
                </label>
                <select
                  value={formData.section || 'business-logic'}
                  onChange={(e) => handleChange('section', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user-action">👤 사용자 액션 (파란색)</option>
                  <option value="business-logic">⚙️ 비즈니스 로직 (초록색)</option>
                  <option value="billing-logic">💰 빌링 로직 (보라색)</option>
                  <option value="error">❌ 실패/에러 (빨간색)</option>
                </select>
              </div>
            </>
          )}

          {/* Decision Node Settings */}
          {selectedNode.type === 'decision' && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                🔷 분기 설정
              </h4>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  성공 레이블
                </label>
                <input
                  type="text"
                  value={formData.yesLabel || '성공'}
                  onChange={(e) => handleChange('yesLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="예: 성공, ACTIVE, Yes"
                />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  실패 레이블
                </label>
                <input
                  type="text"
                  value={formData.noLabel || '실패'}
                  onChange={(e) => handleChange('noLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="예: 실패, ERROR, No"
                />
              </div>
            </div>
          )}

          {/* Note Node Settings */}
          {selectedNode.type === 'note' && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                📝 노트 설정
              </h4>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  이모지
                </label>
                <input
                  type="text"
                  value={formData.emoji || '📝'}
                  onChange={(e) => handleChange('emoji', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="📊"
                  maxLength={2}
                />
              </div>
            </div>
          )}
        </div>

        {/* Node Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p><strong>Node ID:</strong> {selectedNode.id}</p>
          <p className="mt-1"><strong>Position:</strong> ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
        </div>

        {/* Guide */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
          <p className="font-semibold text-blue-800 mb-2">💡 노드 편집 가이드</p>
          <ul className="space-y-1 text-blue-700">
            <li>• 레이블: 노드의 주요 텍스트</li>
            <li>• 설명: 상세 설명 (서브 텍스트)</li>
            <li>• 카테고리: 노드 색상 결정</li>
            <li>• 드래그로 이동 가능</li>
            <li>• Delete 키로 삭제</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
