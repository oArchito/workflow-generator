import { NodeType } from '../../types/workflow';
import { Play, CheckSquare, UserCheck, Settings, Flag } from 'lucide-react';

const nodeTypes: { type: NodeType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'start', label: 'Start Node', icon: <Play size={18} className="text-emerald-500" />, desc: 'Entry point of the workflow' },
  { type: 'task', label: 'Task Node', icon: <CheckSquare size={18} className="text-blue-500" />, desc: 'A manual task to be completed' },
  { type: 'approval', label: 'Approval', icon: <UserCheck size={18} className="text-purple-500" />, desc: 'Requires manager or HRBP approval' },
  { type: 'automated', label: 'Automated Step', icon: <Settings size={18} className="text-amber-500" />, desc: 'Background system action' },
  { type: 'end', label: 'End Node', icon: <Flag size={18} className="text-rose-500" />, desc: 'Workflow completion point' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full z-10 shadow-sm">
      <div className="p-4 border-b border-neutral-100">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-800">Components</h2>
        <p className="text-xs text-neutral-500 mt-1">Drag and drop nodes to build your workflow</p>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="flex flex-col gap-1.5 p-3 bg-neutral-50 border border-neutral-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-sm transition-all"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded shadow-sm border border-neutral-100">
                {node.icon}
              </div>
              <span className="font-medium text-sm text-neutral-700">{node.label}</span>
            </div>
            <p className="text-xs text-neutral-500 pl-9">{node.desc}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};
