import { Node } from '@xyflow/react';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData extends Record<string, unknown> {
  title: string;
}

export interface StartNodeData extends BaseNodeData {
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole: string; // 'Manager' | 'HRBP' | 'Director'
  autoApproveThreshold: number | '';
}

export interface AutomatedNodeData extends BaseNodeData {
  actionId: string;
  parameters: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNode = Node<
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData
>;

export interface SimulationLog {
  step: number;
  nodeId: string;
  nodeTitle: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
}

export interface MockAction {
  id: string;
  label: string;
  params: string[];
}
