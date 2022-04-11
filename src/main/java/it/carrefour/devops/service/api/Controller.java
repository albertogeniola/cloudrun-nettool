package it.carrefour.devops.service.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(path = "/api",
				produces = MediaType.APPLICATION_JSON_VALUE, 
				consumes = MediaType.APPLICATION_JSON_VALUE)

public class Controller {

	@GetMapping(value = "/hello", consumes = MediaType.ALL_VALUE)
	public String helloWorld() {
		log.info("GET /hello"); 
		
		return "{\"message\":\"Hello World!\"}";
	}
}
