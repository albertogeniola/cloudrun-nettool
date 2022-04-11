# Stage 1: Build the frontend
FROM node:12 AS build
WORKDIR /usr/src/app
COPY frontend/ ./
RUN npm install
RUN npm run build --prod

# Stage 2: Install the python files and the frontend static content
FROM python:3.10-slim

WORKDIR /opt/net-tool

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY --from=build /usr/src/app/dist/app ./static

# Note: this will also copy the frontend folder, which we don't need.
COPY ./ ./
RUN rm frontend
RUN pip3 install -r ./requirements.txt

ENV PORT=8080

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
