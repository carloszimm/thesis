# Fork Checking Script

This folder contains the script used to check the number of forks in the repositories mined in the [Github mining scripts](https://github.com/carloszimm/gh-mining-msr22).

## Requirements
* Node.js v18 or superior

## Execution

The scripts can be run by executing the following command:

```sh
$ node index [options]

Options:
--api           The name of the Rx API used in the Mining study (i.e., rxjava, rxjs, and rxswift); default value = rxjava
--github-token  A GitHub API token (recommended to be informed, otherwise the quota is easily exceeded; default value = '' 
```

&ensp; :floppy_disk: After execution, a summary is displayed in the terminal showing the following information:

* Difference: the difference between the total of analyzed repositories and the repositories that don't include a fork among the repositories
* Percentage: the ratio between the difference and the total of analyzed forks times 100.
* Number of repos which missing information: repos that are not available anymore for instance.
* Number of repos in which their parents or siblings were present: indicate the number of repos that have parents or siblings present in the analyzed list

Also, a JSON is created at `./results` with the following name pattern: `repos_without_forks_[api analyzed]`. That JSON file has an array with all the
information (e.g., `owner`, `repoName`, `repoFullName`, etc.) about every examed repository that does not contain a fork (or a sibling with a common parent).
