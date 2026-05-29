import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { Sidebar } from './components/sidebar/Sidebar';
import { ConfigPanel } from './components/panels/ConfigPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { Network } from 'lucide-react';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-50 text-neutral-800 selection:bg-primary/20">
      {/* Header */}
      <header className="h-14 bg-white border-b border-neutral-200 flex items-center px-6 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Network size={20} className="text-primary" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight text-neutral-900">
            HR Workflow Designer
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden relative">
        <ReactFlowProvider>
          <Sidebar />
          
          <div className="flex-1 relative">
            <WorkflowCanvas />
            <SimulationPanel />
          </div>
          
          <ConfigPanel />
        </ReactFlowProvider>
      </main>
    </div>
  );
}

export default App;
