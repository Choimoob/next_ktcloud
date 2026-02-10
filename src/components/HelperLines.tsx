import { memo } from 'react';
import { type Node } from '@xyflow/react';

interface HelperLinesProps {
  horizontal?: number;
  vertical?: number;
}

export const HelperLines = memo(({ horizontal, vertical }: HelperLinesProps) => {
  return (
    <>
      {horizontal !== undefined && (
        <div
          className="absolute left-0 right-0 border-t-2 border-blue-400 border-dashed pointer-events-none z-[1000]"
          style={{ top: `${horizontal}px` }}
        >
          <div className="absolute -top-3 left-2 bg-blue-400 text-white text-xs px-2 py-0.5 rounded">
            Y: {Math.round(horizontal)}
          </div>
        </div>
      )}
      {vertical !== undefined && (
        <div
          className="absolute top-0 bottom-0 border-l-2 border-blue-400 border-dashed pointer-events-none z-[1000]"
          style={{ left: `${vertical}px` }}
        >
          <div className="absolute -left-3 top-2 bg-blue-400 text-white text-xs px-2 py-0.5 rounded -rotate-90 origin-left">
            X: {Math.round(vertical)}
          </div>
        </div>
      )}
    </>
  );
});

HelperLines.displayName = 'HelperLines';

// Helper function to get helper lines based on node positions
export function getHelperLines(
  draggingNode: Node,
  nodes: Node[],
  threshold = 5
): { horizontal?: number; vertical?: number } {
  const nodeA = draggingNode;
  const nodeABounds = {
    left: nodeA.position.x,
    right: nodeA.position.x + (nodeA.width || 0),
    top: nodeA.position.y,
    bottom: nodeA.position.y + (nodeA.height || 0),
    centerX: nodeA.position.x + (nodeA.width || 0) / 2,
    centerY: nodeA.position.y + (nodeA.height || 0) / 2,
  };

  let horizontalLine: number | undefined;
  let verticalLine: number | undefined;
  let minHorizontalDistance = threshold;
  let minVerticalDistance = threshold;

  nodes.forEach((nodeB) => {
    if (nodeB.id === nodeA.id) return;

    const nodeBBounds = {
      left: nodeB.position.x,
      right: nodeB.position.x + (nodeB.width || 0),
      top: nodeB.position.y,
      bottom: nodeB.position.y + (nodeB.height || 0),
      centerX: nodeB.position.x + (nodeB.width || 0) / 2,
      centerY: nodeB.position.y + (nodeB.height || 0) / 2,
    };

    // Check horizontal alignment
    const horizontalChecks = [
      { lineY: nodeBBounds.top, distance: Math.abs(nodeABounds.top - nodeBBounds.top) },
      { lineY: nodeBBounds.centerY, distance: Math.abs(nodeABounds.centerY - nodeBBounds.centerY) },
      { lineY: nodeBBounds.bottom, distance: Math.abs(nodeABounds.bottom - nodeBBounds.bottom) },
    ];

    horizontalChecks.forEach(({ lineY, distance }) => {
      if (distance < minHorizontalDistance) {
        minHorizontalDistance = distance;
        horizontalLine = lineY;
      }
    });

    // Check vertical alignment
    const verticalChecks = [
      { lineX: nodeBBounds.left, distance: Math.abs(nodeABounds.left - nodeBBounds.left) },
      { lineX: nodeBBounds.centerX, distance: Math.abs(nodeABounds.centerX - nodeBBounds.centerX) },
      { lineX: nodeBBounds.right, distance: Math.abs(nodeABounds.right - nodeBBounds.right) },
    ];

    verticalChecks.forEach(({ lineX, distance }) => {
      if (distance < minVerticalDistance) {
        minVerticalDistance = distance;
        verticalLine = lineX;
      }
    });
  });

  return {
    horizontal: horizontalLine,
    vertical: verticalLine,
  };
}

// Helper function to snap node position to helper lines
export function snapPosition(
  position: { x: number; y: number },
  helperLines: { horizontal?: number; vertical?: number },
  node: Node,
  threshold = 5
): { x: number; y: number } {
  const snappedX = position.x;
  const snappedY = position.y;
  
  const nodeWidth = node.width || 0;
  const nodeHeight = node.height || 0;

  let newX = snappedX;
  let newY = snappedY;

  if (helperLines.horizontal !== undefined) {
    // Snap to top
    if (Math.abs(position.y - helperLines.horizontal) < threshold) {
      newY = helperLines.horizontal;
    }
    // Snap to center
    else if (Math.abs(position.y + nodeHeight / 2 - helperLines.horizontal) < threshold) {
      newY = helperLines.horizontal - nodeHeight / 2;
    }
    // Snap to bottom
    else if (Math.abs(position.y + nodeHeight - helperLines.horizontal) < threshold) {
      newY = helperLines.horizontal - nodeHeight;
    }
  }

  if (helperLines.vertical !== undefined) {
    // Snap to left
    if (Math.abs(position.x - helperLines.vertical) < threshold) {
      newX = helperLines.vertical;
    }
    // Snap to center
    else if (Math.abs(position.x + nodeWidth / 2 - helperLines.vertical) < threshold) {
      newX = helperLines.vertical - nodeWidth / 2;
    }
    // Snap to right
    else if (Math.abs(position.x + nodeWidth - helperLines.vertical) < threshold) {
      newX = helperLines.vertical - nodeWidth;
    }
  }

  return { x: newX, y: newY };
}
