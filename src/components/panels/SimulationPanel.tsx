import { useState } from 'react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { simulateWorkflow } from '../../api/mockApi';
import { SimulationLog } from '../../types/workflow';
import { Play, AlertCircle, CheckCircle2, Loader2, FileJson } from 'lucide-react';
import { clsx } from 'clsx';

export const SimulationPanel = () => {
  const { nodes, edges, validate, validationErrors, isRunning, setRunning } = useWorkflowStore();
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleRun = async () => {
    setLogs([]);
    const isValid = validate();
    if (!isValid) {
      setIsOpen(true);
      return;
    }

    setIsOpen(true);
    setRunning(true);
    
    try {
      await simulateWorkflow(nodes, edges, (log: SimulationLog) => {
        setLogs(prev => [...prev, log]);
      });
    } catch (error: any) {
      setLogs(prev => [...prev, {
        step: 0,
        nodeId: 'error',
        nodeTitle: 'Simulation Error',
        status: 'error',
        message: error.message || 'An unknown error occurred'
      }]);
    } finally {
      setRunning(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflow.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className={clsx(
      "absolute bottom-4 left-64 right-80 mx-4 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200 transition-all duration-300 z-20 flex flex-col overflow-hidden",
      isOpen ? "h-64" : "h-14"
    )}>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); handleRun(); }}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Run Simulation
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleExport(); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors text-sm font-medium"
          >
            <FileJson size={16} />
            Export JSON
          </button>

          {validationErrors.length > 0 && !isOpen && (
            <div className="flex items-center gap-1.5 text-rose-500 text-sm font-medium ml-2">
              <AlertCircle size={16} />
              {validationErrors.length} Errors
            </div>
          )}
        </div>
        
        <div className="text-xs font-medium text-neutral-400 select-none">
          {isOpen ? 'Close Panel' : 'View Logs'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 font-mono text-sm">
        {validationErrors.length > 0 ? (
          <div className="space-y-2 mb-4">
            <h3 className="text-rose-600 font-semibold flex items-center gap-2 text-sm font-sans mb-3">
              <AlertCircle size={16} /> Validation Errors
            </h3>
            {validationErrors.map((err, i) => (
              <div key={i} className="text-rose-600 bg-rose-50/50 px-3 py-2 rounded border border-rose-100 flex items-start gap-2">
                <span className="opacity-50 mt-0.5">•</span> {err}
              </div>
            ))}
          </div>
        ) : null}

        {logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                <div className="mt-0.5">
                  {log.status === 'running' && <Loader2 size={16} className="animate-spin text-primary" />}
                  {log.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                  {log.status === 'error' && <AlertCircle size={16} className="text-rose-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-neutral-100 text-neutral-600 text-[10px] px-1.5 py-0.5 rounded font-bold">STEP {log.step}</span>
                    <span className="font-semibold text-neutral-800">{log.nodeTitle}</span>
                  </div>
                  {log.message && (
                    <div className="text-neutral-500 text-xs mt-1">{log.message}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isRunning && logs.length === 0 && validationErrors.length === 0 && (
          <div className="h-full flex items-center justify-center text-neutral-400 text-sm font-sans">
            Ready to simulate. Click "Run Simulation" to begin.
          </div>
        )}
      </div>
    </div>
  );
};
