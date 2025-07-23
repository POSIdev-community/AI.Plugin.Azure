import * as Task from 'azure-pipelines-task-lib/task';
import * as fs from 'fs';
import * as path from 'path';

export class SettingsManager {

    createFile(settings: string): string {
        const tempDirectory = Task.getVariable('Agent.TempDirectory');
        const settingsPath = path.join(tempDirectory!, '.aiproj.json');

        fs.writeFile(settingsPath, settings, function (err) {
            if (err) throw err;
        });

        return settingsPath;
    }
}
