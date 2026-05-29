import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { EndNodeData } from '../../types/workflow';

export const EndNode = ({ data, selected, isConnectable }: NodeProps<any>) => {
  const nodeData = data as EndNodeData;
  return (
    <BaseNode
      title={nodeData.title}
      type="end"
      selected={!!selected}
      isConnectable={isConnectable}
      showSource={false}
    >
      <div className="text-xs text-neutral-500">
        End of workflow
        {nodeData.summaryFlag && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit">
            Generates Summary
          </div>
        )}
      </div>
    </BaseNode>
  );
};
