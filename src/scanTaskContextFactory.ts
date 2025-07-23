import * as Task from 'azure-pipelines-task-lib/task';
import { BranchType } from './enums/branchType';
import { PolicyType } from './enums/policyType';
import { Report } from './enums/reportTypes';
import { SettingsType } from './enums/settingsType';
import { ScanTaskContext } from './models/scanTaskContext';
import { PoliticManager } from './politicManager';
import { SettingsManager } from './settingsManager';

export class ScanTaskContextFactory {

    public getScanContext(): ScanTaskContext {
        const directory = Task.getVariable('Build.Repository.LocalPath');

        const inputProjectName = Task.getInput('projectName');
        const projectName = inputProjectName
            ? inputProjectName
            : Task.getVariable('Build.Repository.Name');

        const artifactsFolder = Task.getVariable('Build.ArtifactStagingDirectory');
        const branch = Task.getVariable('Build.SourceBranchName');

        if (!projectName || !directory || !artifactsFolder || !branch) {
            throw new Error('System variable error');
        }

        const serverAddress = Task.getInput('serverAddress');
        const token = Task.getInput('token');

        if (!serverAddress || !token) {
            throw new Error('Server address or access token were not entered');
        }

        const actionMode = Task.getInput('actionMode');

        const projectID = Task.getInput('projectID');
        const scanResultID = Task.getInput('scanResultID');

        const branchName = (Task.getInput('branchAtServer') === BranchType.Existing)
            ? branch
            : Task.getInput('customBranchName');

        const messageMode = Task.getInput('messageMode');

        const settingsPath = this.getSettingsPath();
        const policyPath = this.getPolicyPath();

        const loglevel = Task.getInput('logLevel');

        const syncMode = Task.getInput('synchronizationMode');

        const reportTypes = this.createReportsTypes();
        const reportsFolder = artifactsFolder;

        const policyFail = Task.getBoolInput('policyFail');

        return new ScanTaskContext(
            projectName!,
            directory!,
            serverAddress!,
            token!,
            actionMode!,
            projectID!,
            branchName,
            scanResultID!,
            messageMode!,
            settingsPath,
            policyPath,
            syncMode!,
            loglevel!,
            reportTypes,
            reportsFolder!,
            policyFail
        );
    }

    private getSettingsPath(): string | null {
        if (Task.getInput('settingsType') == SettingsType.New) {
            const newSettings = Task.getInput('newSettings');
            if (!newSettings) {
                throw new Error('New settings were not entered');
            }
            else {
                return new SettingsManager().createFile(newSettings!);
            }
        }
        return null;
    }

    private getPolicyPath(): string | null {
        if (Task.getInput('policyScanType') == PolicyType.New) {
            return new PoliticManager().createFile(this.createPolicy());
        }
        return null;
    }

    private createPolicy(): string {
        const getFromTemplate = Task.getBoolInput('checkTemplate');
        if (getFromTemplate) {
            const newTemplatePolicy = Task.getInput('newPoliciesWithTemplate');
            if (!newTemplatePolicy) throw new Error('New policies were not entered');
            return newTemplatePolicy;
        }
        const newPolicy = Task.getInput('newPolicies');
        if (!newPolicy) throw new Error('New policies were not entered');
        return newPolicy;
    }

    private createReportsTypes(): string {
        const reports = Object.keys(Report).filter(element => Task.getBoolInput(element));
        reports.push(Report.md);

        return reports.join(' ');
    }
}
