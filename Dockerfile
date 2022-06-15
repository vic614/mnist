FROM python:3.8 as base
RUN mkdir /dependenies
WORKDIR /dependenies
COPY requirements.txt /requirements.txt
RUN pip install --prefix="/dependencies" -r /requirements.txt

FROM python:3.8 as runtime
COPY --from=base /dependencies /usr/local
EXPOSE 8000
COPY . /app
WORKDIR /app
ENTRYPOINT ["gunicorn","-w=4", "--chdir=/app", "-b=0.0.0.0:8080", "main:app"]
# ENTRYPOINT [ "python", "main.py" ]
