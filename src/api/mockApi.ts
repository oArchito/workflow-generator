import { MockAction, SimulationLog, WorkflowNode } from '../types/workflow';
import { Edge } from '@xyflow/react';

export const fetchAutomations = async (): Promise<MockAction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
        { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
        { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
        { id: 'update_db', label: 'Update Database', params: ['table', 'recordId'] }
      ]);
    }, 500);
  });
};

export const simulateWorkflow = async (
  nodes: WorkflowNode[],
  edges: Edge[],
  onLog: (log: SimulationLog) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let currentStep = 1;

    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) {
      reject(new Error("No start node found"));
      return;
    }

    const runNode = async (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      onLog({
        step: currentStep++,
        nodeId: node.id,
        nodeTitle: node.data.title as string,
        status: 'running',
      });

      // Simulate execution time
      await new Promise(r => setTimeout(r, 1000));

      onLog({
        step: currentStep - 1,
        nodeId: node.id,
        nodeTitle: node.data.title as string,
        status: 'completed',
        message: `Successfully executed ${node.data.title}`,
      });

      const outgoingEdges = edges.filter(e => e.source === nodeId);
      if (outgoingEdges.length === 0 && node.type !== 'end') {
        // Warning log maybe?
      }

      for (const edge of outgoingEdges) {
        await runNode(edge.target);
      }
    };

    runNode(startNode.id).then(resolve).catch(reject);
  });
};
