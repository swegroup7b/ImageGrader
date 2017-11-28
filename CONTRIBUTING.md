# How to contribute

## Project​ ​Workflow
To facilitate proper software management, the following project workflow will be used by our
team while managing our GitHub repository at https://github.com/swegroup7b/ImageGrader.

Following are the general principles for how this repository is managed:

* Our git repository will have two long-term branches: the dev branch and the master
branch. The dev branch will contain all of our currently working features, and the master
branch will be used to publish major releases. Only the Scrum Master will have write
access to the master branch. He will merge the changes from the dev branch to the
master branch when an epic is completed. An epic is a collection of fully-functional
features.

* Each separate, stand-alone feature will require the creation of a feature branch, and the
dev branch will be the starting point for creating these branches. Each feature will cover
a collection of related user stories that implement one stand-alone function that adds
value to the web application. Only the developers working on a given feature will have write
access to that feature branch. This will help prevent merge conflicts that could happen
from team members working on code that they were not assigned to work on. After
feature completion, each branch can be merged into dev via pull request. The pull
request must be reviewed and approved by at least 1-2 team members before the Scrum
Master will merge it.

* Each team member will have discretion over creating sub-branches that are based on
one of their feature branches; however, all new features have to be based off of the dev
branch. It is up the team members who own a feature branch to decide whether or
not to create additional branches; they will have full access and control about their
feature branches.

* In general, handling conflicts between the dev branch and a feature branch should be
the responsibility of the feature branch owners. Feature branch owners should regularly
pull updates from the dev branch as they are working. Exceptions could be made if there
is a significant, braking change caused by pulling from the development branch, and the
feature branch owners want to finish their feature before merging it with the new dev
branch commits. If merging in new commits looks like a lengthy process (over 1 hour),
the branch owners must coordinate with one another such that all team members
working on the feature branch have all of their work pushed before the merging process
begins.

* Any teammates working on the same branch need to pull for updates regularly. If a
merge conflict is encountered when a developer pulls in new commits, the developer will
need to resolve the conflict before pushing their commits.

* To the extent possible, all commits should leave the code in a working state. No one
should commit broken code to a branch that another member of the team relies on.

## Important Information to Include
* Types:
  * feat - Features, Enhancements, and overall Improvements
  * fix - Fixes, Bugs, HotFixs, etc...
  * doc - Changes to the Documentation and doesn't actually touch any code.
* Scope:
  * The scope should be where the change took place.
  * Examples: users, core, config, articles
* Subject:
  * The subject line should be clear and concise as to what is being accomplished in the commit.
* General Rules:
  * No Line in the Commit message can be longer than 80 characters.
* Reference: [Angular Conventions](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)


## Submitting the Pull Request

* Push your changes to your topic branch on your fork of the repo.
* Submit a pull request from your topic branch to the master branch on the MEAN.JS repository.
* Be sure to tag any issues your pull request is taking care of / contributing to.
	* By adding "Closes #xyz" to a commit message will auto close the issue once the pull request is merged in.
* Small changes are usually accepted and merged in within a week (provided that 2 collaborators give the okay)
* Larger changes usually spark further discussion and possible changes prior to being merged in.
