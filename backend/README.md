## Create a multi-stage docker image

To compile and package using Docker multi-stage builds

```bash
docker build . -t avito
```

## To run the docker image

```bash
docker run -p 8080:8080 avito
```

And then visit http://localhost:8080 in your browser.

## To use this project in Codefresh

There is also a [codefresh.yml](codefresh.yml) for easy usage with the [Codefresh](codefresh.io) CI/CD platform.

For the simple packaging pipeline see [codefresh-package-only.yml](codefresh-package-only.yml)

More details can be found in [Codefresh documentation](https://codefresh.io/docs/docs/learn-by-example/java/gradle/)

