import * as Task from 'azure-pipelines-task-lib/task';
import * as fs from 'fs';
import * as path from 'path';

export class PoliticManager {

    createFile(politics: string): string {
        const tempDirectory = Task.getVariable('Agent.TempDirectory');
        const policyPath = path.join(tempDirectory!, 'policy.json');

        fs.writeFileSync(policyPath, politics);

        return policyPath;
    }
}
