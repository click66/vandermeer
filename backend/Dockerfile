FROM python:latest as build

RUN apt update -y && apt install -y curl

ENV POETRY_HOME=/usr/local
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app

COPY pyproject.toml poetry.lock ./
COPY . ./

RUN poetry install --without dev --sync


FROM build as dev-runtime

RUN poetry install --with dev --sync

ENTRYPOINT ["poetry"]
CMD ["run", "uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]


FROM python:latest as prod-runtime

COPY --from=build /app /app
WORKDIR /app
CMD ["/app/.venv/bin/uvicorn", "main:app", "--host", "0.0.0.0"]
