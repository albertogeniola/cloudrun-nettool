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
COPY backend/ ./
RUN pip3 install -r ./requirements.txt
COPY entrypoint.sh ./

EXPOSE 8080
ENTRYPOINT [ "./entrypoint.sh" ]