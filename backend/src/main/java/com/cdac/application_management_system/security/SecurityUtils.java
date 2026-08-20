package com.cdac.application_management_system.security;

import com.cdac.application_management_system.entity.PortalUser;
import com.cdac.application_management_system.enums.UserRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static PortalUser requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof PortalUser user) {
            return user;
        }
        throw new RuntimeException("You must be signed in to perform this action.");
    }

    public static boolean isReviewer(PortalUser user) {
        return user.getRole() == UserRole.REVIEWER;
    }
}
