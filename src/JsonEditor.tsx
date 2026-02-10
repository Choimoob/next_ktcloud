import { useState, useEffect } from 'react';
import { Code, Copy, Check, AlertCircle, FileJson } from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';

interface JsonEditorProps {
  nodes: Node[];
  edges: Edge[];
  onImport: (data: { nodes: Node[], edges: Edge[] }) => void;
}

export function JsonEditor({ nodes, edges, onImport }: JsonEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update JSON when nodes/edges change (only if not editing)
  useEffect(() => {
    if (!isEditing) {
      const data = { nodes, edges };
      setJsonText(JSON.stringify(data, null, 2));
    }
  }, [nodes, edges, isEditing]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsEditing(true);
    setJsonText(e.target.value);
    setError(null);
  };

  const handleApply = () => {
    try {
      const data = JSON.parse(jsonText);
      
      // Validate structure
      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('Invalid format: "nodes" must be an array');
      }
      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('Invalid format: "edges" must be an array');
      }

      onImport(data);
      setError(null);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFormat = () => {
    try {
      const data = JSON.parse(jsonText);
      setJsonText(JSON.stringify(data, null, 2));
      setError(null);
    } catch (err) {
      setError('Cannot format: Invalid JSON');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">JSON Editor</h3>
          {isEditing && (
            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
              편집 중
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            포맷
          </button>
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                복사됨!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                복사
              </>
            )}
          </button>
          
          {isEditing && (
            <button
              onClick={handleApply}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
            >
              적용
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-900/50 border-b border-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-200">{error}</div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <span className="text-blue-400 font-semibold">{nodes.length}</span>
          <span>노드</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-400 font-semibold">{edges.length}</span>
          <span>엣지</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-purple-400 font-semibold">{jsonText.length}</span>
          <span>글자</span>
        </div>
      </div>

      {/* JSON Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          value={jsonText}
          onChange={handleJsonChange}
          className="w-full h-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
          style={{ 
            tabSize: 2,
            lineHeight: '1.6',
          }}
          spellCheck={false}
          placeholder="JSON 코드를 입력하거나 붙여넣으세요..."
        />
      </div>

      {/* Footer Help */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <p>💡 <strong>사용법:</strong> 코드 수정 후 "적용" 버튼을 클릭하면 다이어그램에 반영됩니다</p>
      </div>
    </div>
  );
}
