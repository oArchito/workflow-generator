import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { ApprovalNodeData } from '../../types/workflow';

export const ApprovalNode = ({ data, selected, isConnectable }: NodeProps<any>) => {
  const nodeData = data as ApprovalNodeData;
  return (
    <BaseNode
      title={nodeData.title}
      type="approval"
      selected={!!selected}
      isConnectable={isConnectable}
    >
      <div className="flex flex-col gap-1 text-xs">
        <div className="font-medium text-neutral-700">
          Role: <span className="font-normal text-neutral-600">{nodeData.approverRole || 'Any'}</span>
        </div>
        {nodeData.autoApproveThreshold && (
          <div className="text-[11px] text-neutral-500">
            Auto-approve: &lt; ${nodeData.autoApproveThreshold}
          </div>
        )}
      </div>
    </BaseNode>
  );
};
