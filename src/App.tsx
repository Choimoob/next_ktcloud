import { useState } from 'react';
import { FlowDiagram } from './FlowDiagram';
import { SpecificationTable } from './components/SpecificationTable';
import { NodePalette } from './components/NodePalette';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FileText, Workflow } from 'lucide-react';
import type { Node } from '@xyflow/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'table'>('diagram');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<any | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [addNodeTrigger, setAddNodeTrigger] = useState<{ nodeData: any; timestamp: number } | null>(null);
  const [updateNodeTrigger, setUpdateNodeTrigger] = useState<{ nodeId: string; newData: any; timestamp: number } | null>(null);
  const [updateEdgeTrigger, setUpdateEdgeTrigger] = useState<{ edgeId: string; newData: any; timestamp: number } | null>(null);

  // Handler for adding nodes from palette
  const handleAddNode = (nodeData: any) => {
    // Trigger node addition with timestamp to ensure useEffect detects change
    setAddNodeTrigger({ nodeData, timestamp: Date.now() });
  };

  // Handler for updating node data
  const handleUpdateNode = (nodeId: string, newData: any) => {
    // Update local nodes state
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, data: { ...node.data, ...newData } };
          // Update selected node if it's the one being edited
          if (selectedNode?.id === nodeId) {
            setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return node;
      })
    );
    
    // Trigger update in FlowDiagram
    setUpdateNodeTrigger({ nodeId, newData, timestamp: Date.now() });
  };

  // Handler for updating edge data
  const handleUpdateEdge = (edgeId: string, newData: any) => {
    // Update local edges state
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          const updatedEdge = { ...edge, ...newData };
          // Update selected edge if it's the one being edited
          if (selectedEdge?.id === edgeId) {
            setSelectedEdge(updatedEdge);
          }
          return updatedEdge;
        }
        return edge;
      })
    );
    
    // Trigger update in FlowDiagram
    setUpdateEdgeTrigger({ edgeId, newData, timestamp: Date.now() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          NEXT 통합 서비스 흐름도
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          고객 여정부터 서비스 설정까지 - 편집 가능한 다이어그램
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-all ${
              activeTab === 'diagram'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Workflow className="w-4 h-4" />
            편집 모드
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            명세표
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'diagram' ? (
        <div className="flex">
          {/* Left Palette */}
          <NodePalette onAddNode={handleAddNode} />

          {/* Center Canvas */}
          <div className="flex-1">
            <FlowDiagram
              selectedNode={selectedNode}
              selectedEdge={selectedEdge}
              onNodeSelect={setSelectedNode}
              onEdgeSelect={setSelectedEdge}
              onNodesChange={setNodes}
              onEdgesChange={setEdges}
              addNodeTrigger={addNodeTrigger}
              updateNodeTrigger={updateNodeTrigger}
              updateEdgeTrigger={updateEdgeTrigger}
            />
          </div>

          {/* Right Properties Panel */}
          <PropertiesPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={handleUpdateNode}
            onUpdateEdge={handleUpdateEdge}
          />
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-7xl mx-auto">
            <SpecificationTable />
          </div>
        </div>
      )}

      {/* Legend (only in diagram mode) */}
      {activeTab === 'diagram' && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-bold text-sm mb-3">범례 (Legend)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500" />
                <span className="text-xs">콘솔</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-100 border-2 border-cyan-500" />
                <span className="text-xs">API 호출</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-500" />
                <span className="text-xs">NEXT 플랫폼</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-500" />
                <span className="text-xs">빌링 플랫폼</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-500" />
                <span className="text-xs">OpenStack</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-500" />
                <span className="text-xs">실패/에러</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}