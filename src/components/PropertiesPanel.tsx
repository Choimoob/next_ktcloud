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
      <div className="w-80 bg-white border-l border-gray-300" style={{ height: 'calc(100vh - 200px)' }}>
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
      <div className="w-80 bg-white border-l border-gray-300" style={{ height: 'calc(100vh - 200px)' }}>
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
                placeholder="예: Yes, No, Error"
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
                실행 방식 (비동기/동기)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdgeChange('animated', true)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    edgeFormData.animated
                      ? 'bg-purple-500 border-purple-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="font-bold mb-1">⚡ 비동기</div>
                  <div className="text-xs opacity-90">움직이는 점선</div>
                </button>
                <button
                  onClick={() => handleEdgeChange('animated', false)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    !edgeFormData.animated
                      ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold mb-1">🔒 동기</div>
                  <div className="text-xs opacity-90">일반 실선</div>
                </button>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600">
                <p><strong className="text-purple-600">비동기:</strong> API 호출, 백그라운드 작업</p>
                <p className="mt-1"><strong className="text-blue-600">동기:</strong> 즉시 실행, 순차 처리</p>
              </div>
            </div>

            {/* Edge Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <p><strong>Edge ID:</strong> {selectedEdge.id}</p>
              <p className="mt-1"><strong>From:</strong> {selectedEdge.source}</p>
              <p className="mt-1"><strong>To:</strong> {selectedEdge.target}</p>
            </div>

            {/* Guide */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
              <p className="font-semibold text-blue-800 mb-2">💡 선 스타일 가이드</p>
              <ul className="space-y-1 text-blue-700">
                <li>• <strong>애니메이션 ON:</strong> 비동기 작업, 진행 중</li>
                <li>• <strong>애니메이션 OFF:</strong> 동기 작업, 완료됨</li>
                <li>• <strong>레이블:</strong> 조건 분기 표시 (Yes/No)</li>
              </ul>
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
    <div className="w-80 bg-white border-l border-gray-300" style={{ height: 'calc(100vh - 200px)' }}>
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
          {/* Node Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              노드 타입
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded text-sm">
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

          {/* Group Color (for group nodes) */}
          {selectedNode.type === 'group' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                배경 색상
              </label>
              <select
                value={formData.color || 'lightblue'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lightblue">연한 파란색</option>
                <option value="lightgreen">연한 초록색</option>
                <option value="lightpurple">연한 보라색</option>
                <option value="lightpink">연한 분홍색</option>
                <option value="lightyellow">연한 노란색</option>
                <option value="lightgray">연한 회색</option>
                <option value="lightcyan">연한 청록색</option>
                <option value="lightindigo">연한 남색</option>
              </select>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                💡 그룹 노드는 다른 노드들을 감싸는 배경 역할을 합니다. 노드를 그룹 안으로 드래그하세요.
              </div>
            </div>
          )}

          {/* Icon (for process nodes) */}
          {selectedNode.type === 'process' && (
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
          )}

          {/* Section (for process nodes) */}
          {selectedNode.type === 'process' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                섹션 (색상)
              </label>
              <select
                value={formData.section || 'console'}
                onChange={(e) => handleChange('section', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="console">콘솔 (파란색)</option>
                <option value="api-direct">API 호출 (청록색)</option>
                <option value="next-platform">NEXT 플랫폼 (초록색)</option>
                <option value="billing-platform">빌링 플랫폼 (보라색)</option>
                <option value="openstack">OpenStack (주황색)</option>
                <option value="fail">실패/에러 (빨간색)</option>
              </select>
            </div>
          )}

          {/* Status */}
          {selectedNode.type === 'process' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                상태 표시
              </label>
              <input
                type="text"
                value={formData.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: Status: BUILD"
              />
            </div>
          )}

          {/* Audit Log */}
          {selectedNode.type === 'process' && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                📝 감사 로그 (Audit)
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    로그 메시지
                  </label>
                  <input
                    type="text"
                    value={formData.auditLog || ''}
                    onChange={(e) => handleChange('auditLog', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder='예: Audit: "Create Try" 기록'
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    로그 상태
                  </label>
                  <input
                    type="text"
                    value={formData.auditStatus || ''}
                    onChange={(e) => handleChange('auditStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: Attempt, Success, Fail"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Billing */}
          {selectedNode.type === 'process' && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                💰 과금 처리 (Billing)
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    과금 메시지
                  </label>
                  <input
                    type="text"
                    value={formData.billing || ''}
                    onChange={(e) => handleChange('billing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: [START] 과금 시작"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    과금 아이콘
                  </label>
                  <input
                    type="text"
                    value={formData.billingIcon || ''}
                    onChange={(e) => handleChange('billingIcon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="💰"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          {selectedNode.type === 'process' && (
            <div className="border-t pt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                추가 노트
              </label>
              <textarea
                value={formData.note || ''}
                onChange={(e) => handleChange('note', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="추가 설명이나 중요 사항"
                rows={3}
              />
            </div>
          )}

          {/* Note Content (for note nodes) */}
          {selectedNode.type === 'note' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                노트 내용
              </label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="상세 설명..."
                rows={6}
              />
            </div>
          )}
        </div>

        {/* Node Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p><strong>Node ID:</strong> {selectedNode.id}</p>
          <p className="mt-1"><strong>Position:</strong> ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</p>
        </div>
      </div>
    </div>
  );
}