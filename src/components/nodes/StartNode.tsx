import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { StartNodeData } from '../../types/workflow';

export const StartNode = ({ data, selected, isConnectable }: NodeProps<any>) => {
  const nodeData = data as StartNodeData;
  return (
    <BaseNode
      title={nodeData.title}
      type="start"
      selected={!!selected}
      isConnectable={isConnectable}
      showTarget={false}
    >
      <div className="text-xs text-neutral-500">
        Entry point of workflow
      </div>
    </BaseNode>
  );
};
