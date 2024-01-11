export class ScanTaskContext {
    projectName: string;
    scanDirectory: string;
    serverAddress: string;
    token: string;
    actionMode: string;
    projectID: string;
    scanResultID: string;
    messageMode: string;
    settingsPath: string | null;
    policyPath: string | null;
    syncMode: string;
    logLevel: string;
    reportTypes: string;
    reportsFolder: string;
    policyFail: boolean;

    constructor(
        projectName: string,
        scanDirectory: string,
        serverAddress: string,
        token: string,
        actionMode: string,
        projectID: string,
        scanResultID: string,
        messageMode: string,
        settingsPath: string | null,
        policyPath: string | null,
        syncMode: string,
        logLevel: string,
        reportTypes: string,
        reportsFolder: string,
        policyFail: boolean) {
        this.projectName = projectName;
        this.scanDirectory = scanDirectory;
        this.serverAddress = serverAddress;
        this.token = token;
        this.actionMode = actionMode;
        this.projectID = projectID;
        this.scanResultID = scanResultID;
        this.messageMode = messageMode;
        this.settingsPath = settingsPath;
        this.policyPath = policyPath;
        this.syncMode = syncMode;
        this.logLevel = logLevel;
        this.reportTypes = reportTypes;
        this.reportsFolder = reportsFolder;
        this.policyFail = policyFail;
    }
}