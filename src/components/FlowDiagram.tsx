import { useCallback, useState, KeyboardEvent, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ProcessNode } from './ProcessNode';
import { DecisionNode } from './DecisionNode';
import { NoteNode } from './NoteNode';
import { GroupNode } from './GroupNode';
import { Trash2, FolderOpen } from 'lucide-react';
import { serverCreationFlowData } from '../data/serverCreationFlow';

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  note: NoteNode,
  group: GroupNode,
};

interface FlowDiagramProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onNodeSelect: (node: Node | null) => void;
  onEdgeSelect: (edge: Edge | null) => void;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  addNodeTrigger?: { nodeData: any; timestamp: number } | null;
  updateNodeTrigger?: { nodeId: string; newData: any; timestamp: number } | null;
  updateEdgeTrigger?: { edgeId: string; newData: any; timestamp: number } | null;
  registerUndoRedo?: (undo: () => void, redo: () => void, save: () => void) => void;
}

// Use the server creation flow data as initial state
const initialNodes: Node[] = serverCreationFlowData.nodes;
const initialEdges: Edge[] = serverCreationFlowData.edges;

// History management
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export function FlowDiagram({ selectedNode, selectedEdge, onNodeSelect, onEdgeSelect, onNodesChange, onEdgesChange, addNodeTrigger, updateNodeTrigger, updateEdgeTrigger, registerUndoRedo }: FlowDiagramProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoAction = useRef(false);
  const nodeChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save current state to history
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      // Limit history to 50 steps
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Custom nodes change handler with debounced history save
  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChangeInternal(changes);
    
    // Debounce history save for drag operations
    const hasDragChange = changes.some((change: any) => 
      change.type === 'position' && change.dragging === false
    );
    
    if (hasDragChange) {
      if (nodeChangeTimerRef.current) {
        clearTimeout(nodeChangeTimerRef.current);
      }
      nodeChangeTimerRef.current = setTimeout(() => {
        setNodes((currentNodes) => {
          saveToHistory(currentNodes, edges);
          return currentNodes;
        });
      }, 300);
    }
  }, [onNodesChangeInternal, edges, saveToHistory, setNodes]);

  // Custom edges change handler
  const handleEdgesChange = useCallback((changes: any[]) => {
    onEdgesChangeInternal(changes);
  }, [onEdgesChangeInternal]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      isUndoRedoAction.current = true;
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      isUndoRedoAction.current = true;
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(newIndex);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Handle selection change callback
  const handleSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[], edges: Edge[] }) => {
    setSelectedNodes(nodes);
    setSelectedEdges(edges);
  }, []);

  // Notify parent of nodes changes via useEffect to avoid render-time state updates
  useEffect(() => {
    onNodesChange(nodes);
  }, [nodes, onNodesChange]);

  // Notify parent of edges changes via useEffect to avoid render-time state updates
  useEffect(() => {
    onEdgesChange(edges);
  }, [edges, onEdgesChange]);

  // Listen for add node trigger from parent
  useEffect(() => {
    if (addNodeTrigger) {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: addNodeTrigger.nodeData.type,
        position: { 
          x: Math.random() * 400 + 200, 
          y: Math.random() * 400 + 150 
        },
        data: addNodeTrigger.nodeData.data,
        style: {
          ...(addNodeTrigger.nodeData.type === 'group' ? {
            width: 400,
            height: 300,
            zIndex: -1,
          } : addNodeTrigger.nodeData.type === 'process' ? {
            width: 250,
            height: 150,
          } : addNodeTrigger.nodeData.type === 'decision' ? {
            width: 160,
            height: 160,
          } : addNodeTrigger.nodeData.type === 'note' ? {
            width: 300,
            height: 180,
          } : {}),
        },
      };
      setNodes((nds) => [...nds, newNode]);
      saveToHistory([...nodes, newNode], edges);
    }
  }, [addNodeTrigger, setNodes, nodes, edges, saveToHistory]);

  // Listen for update node trigger from parent
  useEffect(() => {
    if (updateNodeTrigger) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === updateNodeTrigger.nodeId) {
            return { ...node, data: { ...node.data, ...updateNodeTrigger.newData } };
          }
          return node;
        })
      );
      saveToHistory(nodes, edges);
    }
  }, [updateNodeTrigger, setNodes, nodes, edges, saveToHistory]);

  // Listen for update edge trigger from parent
  useEffect(() => {
    if (updateEdgeTrigger) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === updateEdgeTrigger.edgeId) {
            const { newData } = updateEdgeTrigger;
            return { 
              ...edge, 
              label: newData.label,
              animated: newData.animated,
              type: newData.type,
              style: newData.style,
              labelStyle: {
                fill: '#374151',
                fontSize: 10,
                fontWeight: 600,
              },
              labelBgStyle: {
                fill: '#f3f4f6',
                stroke: '#9ca3af',
                strokeWidth: 1,
                fillOpacity: 0.95,
              },
              labelBgPadding: [6, 8] as [number, number],
              labelBgBorderRadius: 4,
            };
          }
          return edge;
        })
      );
      saveToHistory(nodes, edges);
    }
  }, [updateEdgeTrigger, setEdges, nodes, edges, saveToHistory]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
        labelStyle: {
          fill: '#374151',
          fontSize: 10,
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#f3f4f6',
          stroke: '#9ca3af',
          strokeWidth: 1,
          fillOpacity: 0.95,
        },
        labelBgPadding: [6, 8] as [number, number],
        labelBgBorderRadius: 4,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory(nodes, [...edges, newEdge]);
    },
    [setEdges, nodes, edges, saveToHistory]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      onEdgeSelect(edge);
    },
    [onEdgeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
    onEdgeSelect(null);
  }, [onNodeSelect, onEdgeSelect]);

  // Update selected node
  const updateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
    saveToHistory(nodes, edges);
  }, [setNodes, nodes, edges, saveToHistory]);

  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => 
        eds.filter((edge) => 
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      onNodeSelect(null);
      saveToHistory(nodes.filter((node) => node.id !== selectedNode.id), edges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    }
  }, [selectedNode, setNodes, setEdges, onNodeSelect, nodes, edges, saveToHistory]);

  // Delete multiple selected nodes
  const deleteMultipleNodes = useCallback(() => {
    if (selectedNodes.length > 0) {
      const selectedNodeIds = selectedNodes.map(n => n.id);
      setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
      setEdges((eds) => 
        eds.filter((edge) => 
          !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
        )
      );
      onNodeSelect(null);
      saveToHistory(nodes.filter((node) => !selectedNodeIds.includes(node.id)), edges.filter((edge) => !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)));
    }
  }, [selectedNodes, setNodes, setEdges, onNodeSelect, nodes, edges, saveToHistory]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedNodes.length > 1) {
        deleteMultipleNodes();
      } else {
        deleteSelectedNode();
      }
    } else if (event.key === 'z' && event.ctrlKey) {
      handleUndo();
    } else if (event.key === 'y' && event.ctrlKey) {
      handleRedo();
    }
  }, [deleteSelectedNode, deleteMultipleNodes, selectedNodes, handleUndo, handleRedo]);

  // Save/Load functions
  const handleSave = useCallback(() => {
    const data = {
      nodes,
      edges,
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'next-server-diagram.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleLoad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
          onNodeSelect(null);
          onEdgeSelect(null);
        } catch (error) {
          alert('파일을 불러오는데 실패했습니다.');
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges, onNodeSelect, onEdgeSelect]);

  // Register undo, redo, and save functions with parent
  useEffect(() => {
    if (registerUndoRedo) {
      registerUndoRedo(handleUndo, handleRedo, handleSave);
    }
  }, [registerUndoRedo, handleUndo, handleRedo, handleSave]);

  return (
    <div 
      className="w-full h-full border border-gray-300 rounded-lg bg-gray-50 relative"
      onKeyDown={handleKeyDown as any}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 50, y: 50, zoom: 0.2 }}
        minZoom={0.05}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.1, maxZoom: 0.25 }}
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        selectionMode="partial"
        multiSelectionKeyCode="Shift"
        onSelectionChange={handleSelectionChange}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        
        {/* Top Panel - Actions */}
        <Panel position="top-right" className="flex gap-2">
          {selectedNodes.length > 1 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg shadow-lg">
              <FolderOpen className="w-4 h-4" />
              {selectedNodes.length}개 선택됨
            </div>
          )}
          
          {selectedNodes.length > 1 && (
            <button
              onClick={deleteMultipleNodes}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              모두 삭제
            </button>
          )}
          
          {selectedNode && selectedNodes.length <= 1 && (
            <button
              onClick={deleteSelectedNode}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              삭제 (Del)
            </button>
          )}
        </Panel>
        
        {/* Info Panel - Multi-selection guide */}
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-3 text-xs max-w-xs">
          <p className="font-semibold text-gray-800 mb-1">💡 다중 선택 방법</p>
          <ul className="space-y-1 text-gray-600">
            <li>• <strong>Shift + 클릭:</strong> 여러 노드 선택</li>
            <li>• <strong>드래그:</strong> 영역으로 선택</li>
            <li>• <strong>Delete 키:</strong> 선택 삭제</li>
            <li>• <strong>마우스 휠/우클릭:</strong> 캔버스 이동</li>
          </ul>
        </Panel>
      </ReactFlow>
    </div>
  );
}