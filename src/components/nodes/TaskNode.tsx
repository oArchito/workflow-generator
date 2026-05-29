import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { TaskNodeData } from '../../types/workflow';

export const TaskNode = ({ data, selected, isConnectable }: NodeProps<any>) => {
  const nodeData = data as TaskNodeData;
  return (
    <BaseNode
      title={nodeData.title}
      type="task"
      selected={!!selected}
      isConnectable={isConnectable}
    >
      <div className="flex flex-col gap-1.5 text-xs">
        {nodeData.assignee ? (
          <div className="flex items-center gap-1.5 text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="truncate">{nodeData.assignee}</span>
          </div>
        ) : (
          <div className="text-neutral-400 italic">Unassigned</div>
        )}
        {nodeData.dueDate && (
          <div className="text-neutral-500 text-[11px]">Due: {nodeData.dueDate}</div>
        )}
      </div>
    </BaseNode>
  );
};
