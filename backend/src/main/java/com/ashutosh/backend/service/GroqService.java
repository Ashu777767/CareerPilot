package com.ashutosh.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ashutosh.backend.dto.EvaluateRequest;
import com.ashutosh.backend.dto.EvaluateResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper =
        new ObjectMapper();

    public String generateQuestion(String role, String difficulty) {

        String prompt =
                "Generate ONE technical interview question for a "
                        + role
                        + " candidate with "
                        + difficulty
                        + " difficulty. Return only the question.";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(groqApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.groq.com/openai/v1/chat/completions",
                HttpMethod.POST,
                request,
                Map.class
        );

        List<Map<String, Object>> choices =
                (List<Map<String, Object>>) response.getBody().get("choices");

        Map<String, Object> firstChoice = choices.get(0);

        Map<String, Object> message =
                (Map<String, Object>) firstChoice.get("message");

        return message.get("content").toString();
    }
    public EvaluateResponse evaluateAnswer(
        EvaluateRequest req)
        throws Exception {

    String prompt =
            "You are an expert Technical Interview Coach evaluating a candidate for a "
                    + req.getRole()
                    + " role.\n\n"
                    + "Question: "
                    + req.getQuestion()
                    + "\n\n"
                    + "Candidate Answer: "
                    + req.getAnswer()
                    + "\n\n"
                    + "Evaluate the answer.\n"
                    + "Return ONLY valid JSON.\n\n"
                    + "{\n"
                    + "\"score\":8,\n"
                    + "\"strengths\":[\"point1\",\"point2\"],\n"
                    + "\"weaknesses\":[\"point1\",\"point2\"],\n"
                    + "\"improvement\":\"suggestion\"\n"
                    + "}";

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(groqApiKey);
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> body = new HashMap<>();

    body.put("model", "llama-3.3-70b-versatile");

    List<Map<String, String>> messages =
            new ArrayList<>();

    messages.add(
            Map.of(
                    "role",
                    "system",
                    "content",
                    "Return ONLY JSON."
            )
    );

    messages.add(
            Map.of(
                    "role",
                    "user",
                    "content",
                    prompt
            )
    );

    body.put("messages", messages);

    HttpEntity<Map<String, Object>> request =
            new HttpEntity<>(body, headers);

    ResponseEntity<String> response =
            restTemplate.exchange(
                    "https://api.groq.com/openai/v1/chat/completions",
                    HttpMethod.POST,
                    request,
                    String.class
            );

    JsonNode root =
            objectMapper.readTree(
                    response.getBody()
            );

    String content =
        root.path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();

content = content.replaceAll("(?s)```json\\s*", "");
content = content.replaceAll("(?s)```", "");
content = content.trim();

int start = content.indexOf("{");
int end = content.lastIndexOf("}");

if(start != -1 && end != -1){
    content = content.substring(start, end + 1);
}
                    System.out.println("========== GROQ RESPONSE ==========");
System.out.println(content);
System.out.println("==================================");

    return objectMapper.readValue(
            content,
            EvaluateResponse.class
    );
}
}