# GUI for the Evaluation of Knee Osteoarthritis (GEKO) Image Grader
This is a project that has been done on behalf of [Dr. Kyle D. Allen](https://www.bme.ufl.edu/people/allen_kyle) and his [Orthopedic Biomedical Engineering Lab](http://bme.ufl.edu/labs/allen/). This web application was build by University of Florida students for CEN3031, Introduction to Software Engineering, under the instruction of Dr. Christine Gardner-McCune.

The software development teams consists of:
* Erol Bahadiroglu: Development Team
* Yilu Bao: Product Manager
* Caleb Bryant: Scrum Master
* Christoph Porwol: Development Team
* Caleb Robey: Development Team
* Andre Williams: Development Team


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

## Contributing
We welcome pull requests from the community! Just be sure to read the [contributing](https://github.com/swegroup7b/ImageGrader/master/CONTRIBUTING.md) doc to get started.

## Credits
* Thank you to Dr. Allen for giving us the opportunity to work on this project!

## License
[The MIT License](LICENSE.md)
