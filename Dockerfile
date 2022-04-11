FROM openjdk:17-alpine

COPY *.cer ./
RUN keytool -v -importcert -alias "Carrefour Root CA" -file c4-root-ca.cer -noprompt -cacerts -storepass changeit
	&& rm *.cer 

# Add the compiled app
ADD target/*.jar app.jar

# Setup the entrypoint
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]
