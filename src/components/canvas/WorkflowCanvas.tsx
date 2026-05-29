import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { StartNode } from '../nodes/StartNode';
import { TaskNode } from '../nodes/TaskNode';
import { ApprovalNode } from '../nodes/ApprovalNode';
import { AutomatedNode } from '../nodes/AutomatedNode';
import { EndNode } from '../nodes/EndNode';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

export const WorkflowCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    addNode,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type as any, position);
    },
    [screenToFlowPosition, addNode],
  );

  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    if (nodes.length === 1) {
      setSelectedNodeId(nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, [setSelectedNodeId]);

  return (
    <div className="flex-1 h-full w-full bg-neutral-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes as any}
        fitView
        className="bg-neutral-50"
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: '#a3a3a3' },
          type: 'smoothstep',
        }}
      >
        <Background gap={24} size={1} color="#e5e5e5" />
        <Controls showInteractive={false} className="bg-white border-neutral-200 shadow-sm rounded-lg" />
        <MiniMap 
          className="bg-white border-neutral-200 shadow-sm rounded-lg"
          maskColor="rgba(245, 245, 245, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
