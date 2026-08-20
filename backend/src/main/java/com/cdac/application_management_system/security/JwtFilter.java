package com.cdac.application_management_system.security;

import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.repository.PortalUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PortalUserRepository userRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        log.debug("JWT filter: {} {}", request.getMethod(), request.getRequestURI());
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                if (!jwtUtil.validateToken(token)) {
                    log.warn("JWT validation failed for {} {}", request.getMethod(), request.getRequestURI());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                    return;
                }

                String email = jwtUtil.getEmailFromToken(token);
                Optional<PortalUser> userOpt = userRepository.findByEmailIgnoreCase(email);
                if (userOpt.isPresent()) {
                    PortalUser user = userOpt.get();
                    log.debug("Authenticated userId={} role={} for {}", user.getId(), user.getRole(), request.getRequestURI());
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            user, null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    log.warn("JWT user not found for email={}", email);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                    return;
                }
            } catch (Exception ex) {
                log.warn("JWT processing error for {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
