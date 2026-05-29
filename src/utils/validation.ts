import type { Edge, Node } from '@xyflow/react';

export const validateWorkflow = (nodes: Node[], edges: Edge[]): string[] => {
  const errors: string[] = [];

  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Missing Start node.');
  } else if (startNodes.length > 1) {
    errors.push('Multiple Start nodes are not allowed.');
  }

  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Missing End node.');
  }

  // Check for disconnected nodes (basic check: must have at least one edge connected if not the only node)
  if (nodes.length > 1) {
    const connectedNodeIds = new Set([
      ...edges.map((e) => e.source),
      ...edges.map((e) => e.target),
    ]);
    
    nodes.forEach((node) => {
      if (!connectedNodeIds.has(node.id)) {
        errors.push(`Node "${node.data.title || node.id}" is disconnected.`);
      }
    });
  }

  // Basic cycle detection (DFS)
  const graph = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!graph.has(edge.source)) graph.set(edge.source, []);
    graph.get(edge.source)!.push(edge.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        errors.push('Cycle detected in the workflow.');
        break;
      }
    }
  }

  return errors;
};
