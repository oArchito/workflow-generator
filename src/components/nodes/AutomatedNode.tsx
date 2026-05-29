import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { AutomatedNodeData } from '../../types/workflow';

export const AutomatedNode = ({ data, selected, isConnectable }: NodeProps<any>) => {
  const nodeData = data as AutomatedNodeData;
  return (
    <BaseNode
      title={nodeData.title}
      type="automated"
      selected={!!selected}
      isConnectable={isConnectable}
    >
      <div className="text-xs">
        <div className="inline-block px-2 py-1 bg-neutral-100 rounded text-neutral-600 font-mono text-[10px]">
          {nodeData.actionId || 'No action selected'}
        </div>
      </div>
    </BaseNode>
  );
};
