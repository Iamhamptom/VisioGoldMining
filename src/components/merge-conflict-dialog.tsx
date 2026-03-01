'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ConflictEntry {
  path: string;
  source?: { artifact_id: string; sha256: string };
  target?: { artifact_id: string; sha256: string };
}

interface MergeConflictDialogProps {
  conflicts: ConflictEntry[];
  sourceBranchName: string;
  targetBranchName: string;
  onResolve: (resolutions: Record<string, 'source' | 'target'>) => void;
  onCancel: () => void;
}

export function MergeConflictDialog({
  conflicts,
  sourceBranchName,
  targetBranchName,
  onResolve,
  onCancel,
}: MergeConflictDialogProps) {
  const [resolutions, setResolutions] = useState<Record<string, 'source' | 'target'>>({});

  const allResolved = conflicts.every((c) => resolutions[c.path]);

  function handleChoice(path: string, choice: 'source' | 'target') {
    setResolutions((prev) => ({ ...prev, [path]: choice }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Merge Conflicts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {conflicts.length} file{conflicts.length !== 1 ? 's' : ''} have conflicting changes
            between <strong>{sourceBranchName}</strong> and <strong>{targetBranchName}</strong>.
            Choose which version to keep for each file.
          </p>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {conflicts.map((conflict) => {
            const choice = resolutions[conflict.path];
            return (
              <div key={conflict.path} className="border rounded-md p-4">
                <p className="font-mono text-sm mb-3">{conflict.path}</p>
                <div className="flex gap-3">
                  <Button
                    variant={choice === 'source' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChoice(conflict.path, 'source')}
                  >
                    Keep {sourceBranchName}
                    {conflict.source && (
                      <span className="ml-2 text-xs opacity-70">
                        ({conflict.source.sha256.slice(0, 8)})
                      </span>
                    )}
                  </Button>
                  <Button
                    variant={choice === 'target' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleChoice(conflict.path, 'target')}
                  >
                    Keep {targetBranchName}
                    {conflict.target && (
                      <span className="ml-2 text-xs opacity-70">
                        ({conflict.target.sha256.slice(0, 8)})
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={!allResolved} onClick={() => onResolve(resolutions)}>
            Resolve & Merge ({Object.keys(resolutions).length}/{conflicts.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
