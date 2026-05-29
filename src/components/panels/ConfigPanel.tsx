import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { X, Plus, Trash2 } from 'lucide-react';
import { fetchAutomations } from '../../api/mockApi';
import { MockAction } from '../../types/workflow';

export const ConfigPanel = () => {
  const { nodes, selectedNodeId, updateNodeData, setSelectedNodeId } = useWorkflowStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const [automations, setAutomations] = useState<MockAction[]>([]);

  const { register, handleSubmit, reset, control, watch } = useForm<any>({
    defaultValues: selectedNode?.data || {}
  });

  const { fields: metaFields, append: appendMeta, remove: removeMeta } = useFieldArray({
    control,
    name: "metadata"
  });

  const { fields: customFields, append: appendCustom, remove: removeCustom } = useFieldArray({
    control,
    name: "customFields"
  });

  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data);
      if (selectedNode.type === 'automated' && automations.length === 0) {
        fetchAutomations().then(setAutomations);
      }
    }
  }, [selectedNode, reset]);

  const selectedActionId = watch('actionId');
  const selectedAction = automations.find(a => a.id === selectedActionId);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-neutral-200 h-full p-6 flex flex-col items-center justify-center text-center text-neutral-400">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-200 mb-4 flex items-center justify-center">
          <SettingsIcon />
        </div>
        <p>Select a node to configure</p>
      </div>
    );
  }

  const onSubmit = (data: any) => {
    updateNodeData(selectedNode.id, data);
  };

  return (
    <aside className="w-80 bg-white border-l border-neutral-200 h-full flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between p-4 border-b border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-800 tracking-tight capitalize">
          {selectedNode.type} Node
        </h2>
        <button onClick={() => setSelectedNodeId(null)} className="p-1 hover:bg-neutral-100 rounded-md text-neutral-500">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form id="config-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Title</label>
            <input {...register('title', { required: true })} className="input-field" />
          </div>

          {selectedNode.type === 'start' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Metadata</label>
                <button type="button" onClick={() => appendMeta({ key: '', value: '' })} className="text-primary text-xs hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {metaFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <input {...register(`metadata.${index}.key` as const)} placeholder="Key" className="input-field py-1 px-2 text-xs" />
                    <input {...register(`metadata.${index}.value` as const)} placeholder="Value" className="input-field py-1 px-2 text-xs" />
                    <button type="button" onClick={() => removeMeta(index)} className="text-neutral-400 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {metaFields.length === 0 && <p className="text-xs text-neutral-400 italic">No metadata added</p>}
              </div>
            </div>
          )}

          {selectedNode.type === 'task' && (
            <>
              <div>
                <label className="label">Description</label>
                <textarea {...register('description')} className="input-field min-h-[80px] resize-y" />
              </div>
              <div>
                <label className="label">Assignee</label>
                <input {...register('assignee')} className="input-field" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="label">Due Date</label>
                <input type="date" {...register('dueDate')} className="input-field" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Custom Fields</label>
                  <button type="button" onClick={() => appendCustom({ key: '', value: '' })} className="text-primary text-xs hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {customFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input {...register(`customFields.${index}.key` as const)} placeholder="Name" className="input-field py-1 px-2 text-xs" />
                      <input {...register(`customFields.${index}.value` as const)} placeholder="Value" className="input-field py-1 px-2 text-xs" />
                      <button type="button" onClick={() => removeCustom(index)} className="text-neutral-400 hover:text-rose-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedNode.type === 'approval' && (
            <>
              <div>
                <label className="label">Approver Role</label>
                <select {...register('approverRole')} className="input-field bg-white">
                  <option value="">Select a role...</option>
                  <option value="Manager">Manager</option>
                  <option value="HRBP">HRBP</option>
                  <option value="Director">Director</option>
                </select>
              </div>
              <div>
                <label className="label">Auto-approve threshold ($)</label>
                <input type="number" {...register('autoApproveThreshold')} className="input-field" placeholder="Leave empty for none" />
              </div>
            </>
          )}

          {selectedNode.type === 'automated' && (
            <>
              <div>
                <label className="label">Action</label>
                <select {...register('actionId')} className="input-field bg-white">
                  <option value="">Select an action...</option>
                  {automations.map(action => (
                    <option key={action.id} value={action.id}>{action.label}</option>
                  ))}
                </select>
              </div>
              {selectedAction && selectedAction.params.length > 0 && (
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <h4 className="text-xs font-semibold text-neutral-600 mb-3 uppercase tracking-wider">Parameters</h4>
                  <div className="space-y-3">
                    {selectedAction.params.map(param => (
                      <div key={param}>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 capitalize">{param}</label>
                        <input {...register(`parameters.${param}` as const)} className="input-field py-1.5 px-2 text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {selectedNode.type === 'end' && (
            <>
              <div>
                <label className="label">End Message</label>
                <input {...register('endMessage')} className="input-field" placeholder="Workflow completed successfully" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="summaryFlag" {...register('summaryFlag')} className="w-4 h-4 text-primary rounded border-neutral-300 focus:ring-primary" />
                <label htmlFor="summaryFlag" className="text-sm text-neutral-700">Generate final summary report</label>
              </div>
            </>
          )}
        </form>
      </div>

      <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
        <button type="submit" form="config-form" className="btn-primary w-full shadow-sm">
          Save Configuration
        </button>
      </div>
    </aside>
  );
};

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
