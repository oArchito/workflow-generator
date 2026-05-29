import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { NodeType, WorkflowNode } from '../types/workflow';
import { validateWorkflow } from '../utils/validation';

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: string[];
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: any) => void;
  setSelectedNodeId: (id: string | null) => void;
  
  validate: () => boolean;
  
  // For Simulation
  isRunning: boolean;
  setRunning: (isRunning: boolean) => void;
}

const getDefaultData = (type: NodeType) => {
  switch (type) {
    case 'start':
      return { title: 'Start', metadata: [] };
    case 'task':
      return { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':
      return { title: 'Approval Step', approverRole: '', autoApproveThreshold: '' };
    case 'automated':
      return { title: 'Automated Step', actionId: '', parameters: {} };
    case 'end':
      return { title: 'End', endMessage: '', summaryFlag: false };
    default:
      return { title: 'Node' };
  }
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  isRunning: false,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (type, position) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: getDefaultData(type) as any,
    };
    
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },

  validate: () => {
    const { nodes, edges } = get();
    const errors = validateWorkflow(nodes, edges);
    set({ validationErrors: errors });
    return errors.length === 0;
  },

  setRunning: (isRunning) => {
    set({ isRunning });
  }
}));
