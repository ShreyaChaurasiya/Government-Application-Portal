package com.cdac.application_management_system.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String query = request.getQueryString();
        String path = query == null ? uri : uri + "?" + query;

        try {
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            log.error("Request failed {} {} — {}", method, path, ex.getMessage(), ex);
            throw ex;
        } finally {
            long duration = System.currentTimeMillis() - start;
            int status = response.getStatus();
            if (status >= 500) {
                log.error("HTTP {} {} → {} ({} ms)", method, path, status, duration);
            } else if (status >= 400) {
                log.warn("HTTP {} {} → {} ({} ms)", method, path, status, duration);
            } else {
                log.info("HTTP {} {} → {} ({} ms)", method, path, status, duration);
            }
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith("/actuator") || uri.startsWith("/h2-console");
    }
}
