export enum ExitCodes {
    Ok = 0,
    PoliticFailed = 10,
    Cancelled = 100,

    DirectoryNotFound = 2,
    InvalidLicense = 3,
    ProjectNotFound = 4,
    InvalidProjectSettings = 5,
    NotCriticalErrorRecieved = 6,
    EmailSendingError = 7,
    ProjectFileNotExists = 8,
    InvalidReportsFolder = 9,
    InvalidReportSettings = 11,
    CertificateNotFound = 12,
    CertificatePasswordIsNotCorrect = 23,
    ServerCertificateNotFound = 24,
    ScanRemoved = 13,

    InvalidAutocheckAuthentication = 14,
    InvalidAutocheckProxy = 15,
    InvalidAutocheckHost = 16,
    InvalidPolicies = 17,

    CriticalCoreError = 18,
    CoreNotFound = 19,
    RecoverableSourcesNotFound = 20,
    LifetimeTimeout = 21,

    UpdateError = 22,
    ServerUriIsInvalid = 25,
    SchedulerServiceIsRunning = 26,
    VersionIsOutdated = 27,
    ScanAgentsNotFound = 28,
    AccessTokenIsInvalid = 29,

    PolicySettingsFileNotExists = 30,
    ProjectScanIsAlreadyRunning = 31,
    ConnectionToServerIsFailed = 32,
    FailedRefreshSources = 33,
    FailedPoliciesAndNotCriticalError = 60,

    RunAnotherProcessFailed = -2,
    FalseInitKeeper = -1,

    UnknownError = 1000
};