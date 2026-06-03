## [1.3.1]

- Added support for AI.Shell 5.3.0.
- Minor bugfix.

## [1.3.0]

- Added support for AI.Shell 5.0.0.
- Added the 'Branch at PT AI Server' parameter to the project task. You can select one of the two options:
    - "From pipeline environment" if the name of the scanned branch is specified in the pipeline environment variable.
    - "Custom branch" if you need to specify a branch manually (enter a name in the Branch name field).

## [1.2.0]

- Improved the vulnerability description template and added a link to download the report in HTML.
- Added the following scan report types:
    - Autocheck report
    - SARIF report
    - OWASP Top 10 2021
    - OWASP Mobile Top 10 2016
    - SANS Top 25
    - NIST 800-53 Rev. 4
    - EAL4 (GOST 15408-3)
    - PCI DSS 3.2.
- Changed scan start parameters related to reports. Instead of `--reports` and `--report-type`, now only the `--report` parameter is used.
- The plugin is now available in Visual Studio Marketplace.
