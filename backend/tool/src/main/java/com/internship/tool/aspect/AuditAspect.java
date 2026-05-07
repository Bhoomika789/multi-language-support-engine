package com.internship.tool.aspect;

import java.time.LocalDateTime;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    @Before(
        "execution(* com.internship.tool.controller.*.*(..))"
    )
    public void logApiCall(JoinPoint joinPoint) {

        System.out.println("\n========== AUDIT LOG ==========");

        System.out.println(
                "Method Called: "
                + joinPoint.getSignature().getName()
        );

        System.out.println(
                "Time: "
                + LocalDateTime.now()
        );

        System.out.println("================================\n");
    }
}