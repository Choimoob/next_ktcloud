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
  registerUndoRedo
}: FlowDiagramProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  // Add node from palette trigger
  useEffect(() => {
    if (!addNodeTrigger) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: addNodeTrigger.nodeData.type,
      position: { x: 300, y: 200 },
      data: { ...addNodeTrigger.nodeData.data },
      style: addNodeTrigger.nodeData.type === 'group' 
        ? { width: 400, height: 300, zIndex: -1 }
        : { width: 200, height: 100 }
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
  }, [onNodeSelect, onEdgeSelect]);

  // Delete selected node/edge
  const handleDelete = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      onNodeSelect(null);
      saveToHistory();
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
      onEdgeSelect(null);
      saveToHistory();
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges, onNodeSelect, onEdgeSelect, saveToHistory]);

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
    },
    [handleDelete, undo, redo, saveToFile]
  );

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
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        
        {/* Delete Panel */}
        {(selectedNode || selectedEdge) && (
          <Panel position="top-right">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              Delete 키로 삭제
            </button>
          </Panel>
        )}

        {/* Info Panel */}
        <Panel position="bottom-left">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-xs text-gray-600 border border-gray-200">
            <p><strong>노드:</strong> {nodes.length}개 | <strong>연결:</strong> {edges.length}개</p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
