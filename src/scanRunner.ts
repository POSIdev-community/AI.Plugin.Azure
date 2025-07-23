import * as Task from 'azure-pipelines-task-lib/task';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ActionMode } from "./enums/actionMode";
import { ExitCodes } from './enums/exitCodes';
import { MessageMode } from "./enums/messageMode";
import { Report } from './enums/reportTypes';
import { ScanTaskContext } from './models/scanTaskContext';

export class ScanRunner {

    private readonly scanTaskContext: ScanTaskContext;

    constructor(scanTaskContext: ScanTaskContext) {
        this.scanTaskContext = scanTaskContext;
    }

    public run() {
        let scanArgs: string[] = [
            '-u',
            this.scanTaskContext.serverAddress,
            '-t',
            this.scanTaskContext.token
        ];

        if (this.scanTaskContext.actionMode == ActionMode.CheckResult) {
            this.checkScanStatus(scanArgs);
            return;
        }
        this.startScan(scanArgs);
    }

    private checkScanStatus(scanArgs: string[]) {
        if (!this.scanTaskContext.projectID || !this.scanTaskContext.scanResultID) {
            Task.setResult(Task.TaskResult.Failed, "Project ID or Scan Result ID were not entered");
            return;
        }
        scanArgs.push(
            '--status',
            '--project-id',
            this.scanTaskContext.projectID,
            '--scan-result-id',
            this.scanTaskContext.scanResultID
        );
        if (this.scanTaskContext.messageMode == MessageMode.One) scanArgs.push('--no-wait');

        console.log(`##[debug]AI.Shell run command: ${scanArgs.join(' ')}`);
        let scanProcess = child_process.spawn('aisa', scanArgs, {shell: true, stdio: 'inherit'});
        scanProcess.on('exit', () => {
            if (scanProcess.exitCode != ExitCodes.Ok) {
                Task.setResult(Task.TaskResult.Failed, 'Checking result was failed');
            }
        });
    }

    private startScan(scanArgs: string[]) {
        scanArgs.push(
            '--project-name',
            `"${this.scanTaskContext.projectName}"`,
            '--scan-target',
            `"${this.scanTaskContext.scanDirectory}"`,
            '--create-project',
            '--create-branch',
        );

        if (this.scanTaskContext.settingsPath) {
            scanArgs.push('--project-settings-file');
            scanArgs.push(`"${this.scanTaskContext.settingsPath}"`);
        }

        if (this.scanTaskContext.policyPath) {
            scanArgs.push('--policies-path');
            scanArgs.push(`"${this.scanTaskContext.policyPath}"`);
        }

        if (this.scanTaskContext.branchName && this.scanTaskContext.branchName.trim() !== '') {
            scanArgs.push('--branch-name');
            scanArgs.push(`"${this.scanTaskContext.branchName}"`);
        }

        scanArgs.push('--log-level');
        scanArgs.push(this.scanTaskContext.logLevel);

        if (this.scanTaskContext.syncMode == 'async') {
            scanArgs.push('--no-wait');

            console.log(`##[debug]AI.Shell run command: ${scanArgs.join(' ')}`);
            let scanProcess = child_process.spawn('aisa', scanArgs, {shell: true, stdio: 'inherit'});

            scanProcess.on('exit', () => {
                if (scanProcess.exitCode != ExitCodes.Ok) {
                    Task.setResult(Task.TaskResult.Failed, 'Project scan failed');
                }
            });

            return;
        }

        if (this.scanTaskContext.reportTypes) {
            scanArgs.push('--reports-folder');
            scanArgs.push(`"${this.scanTaskContext.reportsFolder}"`);
            scanArgs.push('--report');
            scanArgs.push(this.scanTaskContext.reportTypes);
            if (this.moreThanOnlyOneMarkdownReport()) {
                const additionalData: Record<string, string> = {};

                const teamFoundationCollectionUri = Task.getVariable('System.TeamFoundationCollectionUri');
                additionalData['OrganizationUri'] = teamFoundationCollectionUri!;
                
                const projectName = Task.getVariable('Build.Repository.Name')
                additionalData['ProjectName'] = projectName!;

                const buildId = Task.getVariable('Build.BuildId')
                additionalData['BuildId'] = buildId!;

                scanArgs.push('--report-additional-data');
                scanArgs.push(JSON.stringify(JSON.stringify(additionalData)));
            }
        }

        console.log(`##[debug]AI.Shell run command: ${scanArgs.join(' ')}`);
        let scanProcess = child_process.spawn('aisa', scanArgs, {shell: true, stdio: 'inherit'});

        scanProcess.on('exit', () => {
            this.handleScanFinish(scanProcess.exitCode!);
        });
    }

    private handleScanFinish(exitCode: ExitCodes) {
        switch (exitCode) {
            case ExitCodes.PoliticFailed: 
            case ExitCodes.FailedPoliciesAndNotCriticalError: {
                if (this.scanTaskContext.policyFail) {
                    Task.setResult(Task.TaskResult.Failed, 'Project did not pass the security policy');
                }
                break;
            }
            case ExitCodes.InvalidProjectSettings: {
                Task.setResult(Task.TaskResult.Failed, 'Invalid project settings');
                return;
            }
            case ExitCodes.InvalidPolicies: {
                Task.setResult(Task.TaskResult.Failed, 'Invalid policy settings');
                return;
            }
            default: {
                if (exitCode != ExitCodes.Ok && exitCode != ExitCodes.NotCriticalErrorRecieved) {
                    Task.setResult(Task.TaskResult.Failed, 'Project scan failed');
                    return;
                }
            }
        }

        let mdFileName = fs.readdirSync(this.scanTaskContext.reportsFolder).filter(file => file.match(new RegExp("\\.md", 'ig')))[0];
        const mdFilePath = path.join(this.scanTaskContext.reportsFolder, mdFileName);
        Task.uploadSummary(mdFilePath);

        if (this.scanTaskContext.reportTypes && this.moreThanOnlyOneMarkdownReport()) {
            this.uploadReports(new Set([mdFilePath]));
        }
    }

    private moreThanOnlyOneMarkdownReport() {
        return this.scanTaskContext.reportTypes != Report.md;
    }

    private uploadReports(excludeReportFilePaths: Set<string>) {
        const currentDir = this.scanTaskContext.reportsFolder;
        const uploadDir = path.join(currentDir, 'reportsToUpload');
        fs.mkdirSync(uploadDir);

        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const currentFilePath = path.join(currentDir, file);

            if (fs.lstatSync(currentFilePath).isDirectory() || excludeReportFilePaths.has(currentFilePath)) {
                continue;
            }

            const uploadFilePath = path.join(uploadDir, file);
            fs.renameSync(currentFilePath, uploadFilePath);
        };

        Task.uploadArtifact('Report', uploadDir, 'Reports');
    }
}
