import type { ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { clsx } from 'clsx';
import { Play, CheckSquare, UserCheck, Settings, Flag } from 'lucide-react';
import type { NodeType } from '../../types/workflow';

interface BaseNodeProps {
  title: string;
  type: NodeType;
  selected: boolean;
  children?: ReactNode;
  isConnectable: boolean;
  showSource?: boolean;
  showTarget?: boolean;
}

const getIcon = (type: NodeType) => {
  switch (type) {
    case 'start': return <Play size={16} className="text-emerald-500" />;
    case 'task': return <CheckSquare size={16} className="text-blue-500" />;
    case 'approval': return <UserCheck size={16} className="text-purple-500" />;
    case 'automated': return <Settings size={16} className="text-amber-500" />;
    case 'end': return <Flag size={16} className="text-rose-500" />;
    default: return null;
  }
};

export const BaseNode = ({
  title,
  type,
  selected,
  children,
  isConnectable,
  showSource = true,
  showTarget = true,
}: BaseNodeProps) => {
  return (
    <div className={clsx(
      "min-w-[200px] bg-white rounded-xl shadow-sm border transition-all duration-200",
      selected ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
    )}>
      {showTarget && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-neutral-100 border-2 border-neutral-300 hover:bg-primary hover:border-primary transition-colors"
        />
      )}
      
      <div className="flex items-center gap-2 p-3 border-b border-neutral-100 bg-neutral-50/50 rounded-t-xl">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-neutral-100 shadow-sm">
          {getIcon(type)}
        </div>
        <div className="font-medium text-sm text-neutral-800 tracking-tight">{title}</div>
      </div>
      
      {children && (
        <div className="p-3">
          {children}
        </div>
      )}

      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-neutral-100 border-2 border-neutral-300 hover:bg-primary hover:border-primary transition-colors"
        />
      )}
    </div>
  );
};
