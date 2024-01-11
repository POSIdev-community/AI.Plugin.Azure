import * as Task from 'azure-pipelines-task-lib/task';
import { ScanRunner } from './scanRunner';
import { ScanTaskContextFactory } from './scanTaskContextFactory';

try {
    new ScanRunner(new ScanTaskContextFactory().getScanContext()).run();
}
catch(err) {
    Task.setResult(Task.TaskResult.Failed, (err as Error).message);
}