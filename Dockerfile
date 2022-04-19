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
ENV PORT 8080
ENV REQUEST_TIMEOUT 3600

COPY --from=build /usr/src/app/dist/app ./static
COPY backend/ ./
RUN pip3 install -r ./requirements.txt

# Install network tools
RUN apt-get update && apt-get install iputils-ping net-tools -y

COPY entrypoint.sh ./

EXPOSE ${PORT}
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]