export class ScanTaskContext {
    constructor(
        public projectName: string,
        public scanDirectory: string,
        public serverAddress: string,
        public token: string,
        public actionMode: string,
        public projectID: string,
        public branchName: string | undefined,
        public scanResultID: string,
        public messageMode: string,
        public settingsPath: string | null,
        public policyPath: string | null,
        public syncMode: string,
        public logLevel: string,
        public reportTypes: string,
        public reportsFolder: string,
        public policyFail: boolean
    ) { }
}
