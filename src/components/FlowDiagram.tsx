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
  SelectionMode,
  type OnNodesChange,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ProcessNode } from './ProcessNode';
import { DecisionNode } from './DecisionNode';
import { NoteNode } from './NoteNode';
import { GroupNode } from './GroupNode';
import { HelperLines, getHelperLines, snapPosition } from './HelperLines';
import { 
  Trash2, 
  FolderOpen, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalSpaceAround
} from 'lucide-react';
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
  registerDelete?: (deleteFunc: () => void) => void;
}

// Use the server creation flow data as initial state
const initialNodes: Node[] = serverCreationFlowData.nodes;
const initialEdges: Edge[] = serverCreationFlowData.edges;

// History management
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export function FlowDiagram({ 
  selectedNode, 
  selectedEdge, 
  onNodeSelect, 
  onEdgeSelect, 
  onNodesChange, 
  onEdgesChange,
  addNodeTrigger,
  updateNodeTrigger,
  updateEdgeTrigger,
  registerUndoRedo,
  registerDelete
}: FlowDiagramProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  
  // Helper Lines state
  const [helperLines, setHelperLines] = useState<{ horizontal?: number; vertical?: number }>({});
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Track Shift key
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    const handleKeyUp = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Save to history (throttled)
  const saveToHistory = useCallback(() => {
    setTimeout(() => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ nodes, edges });
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    }, 0);
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
      onNodesChange(prevState.nodes);
      onEdgesChange(prevState.edges);
    }
  }, [historyIndex, history, setNodes, setEdges, onNodesChange, onEdgesChange]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      onNodesChange(nextState.nodes);
      onEdgesChange(nextState.edges);
    }
  }, [historyIndex, history, setNodes, setEdges, onNodesChange, onEdgesChange]);

  // Save to JSON file
  const saveToFile = useCallback(() => {
    const data = { nodes, edges };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'next-server-diagram.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Register undo/redo functions
  useEffect(() => {
    if (registerUndoRedo) {
      registerUndoRedo(undo, redo, saveToFile);
    }
  }, [undo, redo, saveToFile, registerUndoRedo]);

  // Listen for updateNodeData events from GroupNode
  useEffect(() => {
    const handleUpdateNodeData = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { nodeId, data: newData } = customEvent.detail;
      
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            // Update data and draggable status
            return { 
              ...node, 
              data: { ...node.data, ...newData },
              draggable: !newData.locked // 잠금 상태면 드래그 불가
            };
          }
          return node;
        })
      );
      saveToHistory();
    };

    window.addEventListener('updateNodeData', handleUpdateNodeData);
    
    return () => {
      window.removeEventListener('updateNodeData', handleUpdateNodeData);
    };
  }, [setNodes, saveToHistory]);

  // Add node from palette trigger
  useEffect(() => {
    if (!addNodeTrigger) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: addNodeTrigger.nodeData.type,
      position: { x: 300, y: 200 },
      data: { ...addNodeTrigger.nodeData.data },
      // Group 노드만 고정 크기, 나머지는 자동 크기
      ...(addNodeTrigger.nodeData.type === 'group' && {
        style: { width: 400, height: 300, zIndex: -1 }
      })
    };

    setNodes((nds) => [...nds, newNode]);
  }, [addNodeTrigger, setNodes]);

  // Update node from properties panel trigger
  useEffect(() => {
    if (!updateNodeTrigger) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === updateNodeTrigger.nodeId) {
          return { ...node, data: { ...node.data, ...updateNodeTrigger.newData } };
        }
        return node;
      })
    );
  }, [updateNodeTrigger, setNodes]);

  // Update edge from properties panel trigger
  useEffect(() => {
    if (!updateEdgeTrigger) return;

    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === updateEdgeTrigger.edgeId) {
          return { ...edge, ...updateEdgeTrigger.newData };
        }
        return edge;
      })
    );
  }, [updateEdgeTrigger, setEdges]);

  // Sync nodes/edges to parent
  useEffect(() => {
    onNodesChange(nodes);
  }, [nodes]);

  useEffect(() => {
    onEdgesChange(edges);
  }, [edges]);

  // Connect nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  // Node click
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
      onEdgeSelect(null);
    },
    [onNodeSelect, onEdgeSelect]
  );

  // Edge click
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      onEdgeSelect(edge);
      onNodeSelect(null);
    },
    [onEdgeSelect, onNodeSelect]
  );

  // Pane click (deselect)
  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
    onEdgeSelect(null);
    setSelectedNodes([]);
  }, [onNodeSelect, onEdgeSelect]);

  // Selection change (다중 선택)
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodesArray }: { nodes: Node[] }) => {
      setSelectedNodes(selectedNodesArray);
      
      // Single node selected
      if (selectedNodesArray.length === 1) {
        onNodeSelect(selectedNodesArray[0]);
        onEdgeSelect(null);
      } 
      // Multiple nodes or none
      else {
        onNodeSelect(null);
        onEdgeSelect(null);
      }
    },
    [onNodeSelect, onEdgeSelect]
  );

  // Delete selected node/edge or multiple nodes
  const handleDelete = useCallback(() => {
    if (selectedNodes.length > 0) {
      // Delete multiple selected nodes
      const selectedNodeIds = selectedNodes.map(n => n.id);
      setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
      setEdges((eds) => eds.filter((e) => 
        !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
      ));
      setSelectedNodes([]);
      onNodeSelect(null);
      saveToHistory();
    } else if (selectedNode) {
      // Delete single node
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      onNodeSelect(null);
      saveToHistory();
    } else if (selectedEdge) {
      // Delete edge
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      onEdgeSelect(null);
      saveToHistory();
    }
  }, [selectedNodes, selectedNode, selectedEdge, setNodes, setEdges, onNodeSelect, onEdgeSelect, saveToHistory]);

  // Register delete function
  useEffect(() => {
    if (registerDelete) {
      registerDelete(handleDelete);
    }
  }, [handleDelete, registerDelete]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Delete key
      if (event.key === 'Delete' || event.key === 'Backspace') {
        handleDelete();
      }
      // Undo: Ctrl+Z / Cmd+Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y / Cmd+Shift+Z
      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        redo();
      }
      // Save: Ctrl+S / Cmd+S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveToFile();
      }
      // Select All: Ctrl+A / Cmd+A
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        setSelectedNodes(nodes);
      }
    },
    [handleDelete, undo, redo, saveToFile, nodes]
  );

  // Node drag handler (show helper lines when Shift is pressed)
  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (!isShiftPressed) {
        setHelperLines({});
        return;
      }

      const lines = getHelperLines(node, nodes, 15);
      setHelperLines(lines);
    },
    [nodes, isShiftPressed]
  );

  // Node drag stop handler (snap to position if Shift was pressed)
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (isShiftPressed && (helperLines.horizontal !== undefined || helperLines.vertical !== undefined)) {
        const snappedPosition = snapPosition(node.position, helperLines, node, 15);
        
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return { ...n, position: snappedPosition };
            }
            return n;
          })
        );
      }
      
      setHelperLines({});
      saveToHistory();
    },
    [isShiftPressed, helperLines, setNodes, saveToHistory]
  );

  // Alignment functions for multiple nodes - 단순화: 수평/수직 정렬만
  const alignHorizontally = useCallback(() => {
    if (selectedNodes.length < 2) return;
    
    // Y축 기준으로 정렬 (가로선상에 배치)
    const centerYs = selectedNodes.map(n => n.position.y + (n.height || 0) / 2);
    const avgCenterY = centerYs.reduce((a, b) => a + b, 0) / centerYs.length;
    
    setNodes((nds) =>
      nds.map((n) => {
        if (selectedNodes.some(sn => sn.id === n.id)) {
          return { ...n, position: { ...n.position, y: avgCenterY - (n.height || 0) / 2 } };
        }
        return n;
      })
    );
    saveToHistory();
  }, [selectedNodes, setNodes, saveToHistory]);

  const alignVertically = useCallback(() => {
    if (selectedNodes.length < 2) return;
    
    // X축 기준으로 정렬 (세로선상에 배치)
    const centerXs = selectedNodes.map(n => n.position.x + (n.width || 0) / 2);
    const avgCenterX = centerXs.reduce((a, b) => a + b, 0) / centerXs.length;
    
    setNodes((nds) =>
      nds.map((n) => {
        if (selectedNodes.some(sn => sn.id === n.id)) {
          return { ...n, position: { ...n.position, x: avgCenterX - (n.width || 0) / 2 } };
        }
        return n;
      })
    );
    saveToHistory();
  }, [selectedNodes, setNodes, saveToHistory]);

  return (
    <div className="w-full h-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Delete"
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        
        {/* Helper Lines */}
        {isShiftPressed && <HelperLines horizontal={helperLines.horizontal} vertical={helperLines.vertical} />}
        
        {/* Alignment Toolbar - show when 2+ nodes selected */}
        {selectedNodes.length >= 2 && (
          <Panel position="top-center">
            <div className="bg-white px-8 py-3 rounded-lg shadow-xl border-2 border-blue-400 min-w-[420px]">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                  {selectedNodes.length}개 노드 정렬
                </span>
                
                {/* Horizontal Alignment */}
                <button
                  onClick={alignHorizontally}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition-colors whitespace-nowrap"
                  title="수평 정렬 (Y축 기준)"
                >
                  <AlignHorizontalJustifyCenter className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">수평 정렬</span>
                </button>
                
                {/* Vertical Alignment */}
                <button
                  onClick={alignVertically}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded transition-colors whitespace-nowrap"
                  title="수직 정렬 (X축 기준)"
                >
                  <AlignVerticalJustifyCenter className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">수직 정렬</span>
                </button>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}