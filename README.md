###GUI for the Evaluation of Knee Osteoarthritis (GEKO) Image Grader
This is a project that has been done on behalf of Dr. Kyle D. Allen and his Biomedical Engineering Osteoarthritis lab. See his [website](https://www.bme.ufl.edu/people/allen_kyle) for more information on his research. This project was done by University of Florida students for CEN3031, Introduction to Software Engineering, under the instruction of Dr. Christine Gardner-McCune.

The software development teams consists of:
* Erol Bahadiroglu: Development Team
* Yilu Bao: Product Manager
* Caleb Bryant: Scrum Master
* Christoph Porwol: Development Team
* Caleb Robey: Development Team
* Andre Williams: Development Team

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
value to the webapp. Only the developers working on a given feature will have write
access to that feature branch. This will help prevent merge conflicts that could happen
from team members working on code that they were not assigned to work on. After
feature completion, each branch can be merged into dev via pull request. The pull
request must be reviewed and approved by at least 1-2 team members before the Scrum
Master will merge it.

* Each team member will have discretion over creating sub-branches that are based on
one of their feature branches; however, all new features have to be based off of the dev
branch. It is up the the team members who own a feature branch to decide whether or
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

### Production deploy with Docker

* Production deployment with compose:
```bash
$ docker-compose -f docker-compose-production.yml up -d
```

* Production deployment with just Docker:
```bash
$ docker build -t mean -f Dockerfile-production .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
```

## Getting Started With MEAN.JS
You have your application running, but there is a lot of stuff to understand. We recommend you go over the [Official Documentation](http://meanjs.org/docs.html).
In the docs we'll try to explain both general concepts of MEAN components and give you some guidelines to help you improve your development process. We tried covering as many aspects as possible, and will keep it updated by your request. You can also help us develop and improve the documentation by checking out the *gh-pages* branch of this repository.


## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/meanjs/mean/blob/master/CONTRIBUTING.md) doc to get started.

## Credits
Inspired by the great work of [Madhusudhan Srinivasa](https://github.com/madhums/)
The MEAN name was coined by [Valeri Karpov](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and).

## License
[The MIT License](LICENSE.md)
