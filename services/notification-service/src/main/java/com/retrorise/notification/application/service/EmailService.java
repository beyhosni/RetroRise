package com.retrorise.notification.application.service;

import com.retrorise.notification.domain.model.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Service for sending emails.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.from:noreply@retrorise.com}")
    private String fromEmail;

    @Value("${notification.email.enabled:true}")
    private boolean emailEnabled;

    /**
     * Sends a simple text email.
     *
     * @param to The recipient email
     * @param subject The email subject
     * @param text The email content
     * @return true if the email was sent successfully, false otherwise
     */
    public boolean sendSimpleEmail(String to, String subject, String text) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would send email to: {}, subject: {}", to, subject);
            return true;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);

            log.info("Simple email sent successfully to: {}, subject: {}", to, subject);
            return true;
        } catch (Exception e) {
            log.error("Error sending simple email to: {}, subject: {}", to, subject, e);
            return false;
        }
    }

    /**
     * Sends an HTML email using a template.
     *
     * @param to The recipient email
     * @param subject The email subject
     * @param templateName The name of the template
     * @param context The template context
     * @return true if the email was sent successfully, false otherwise
     */
    public boolean sendHtmlEmail(String to, String subject, String templateName, Context context) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would send HTML email to: {}, subject: {}, template: {}", 
                    to, subject, templateName);
            return true;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            // Process the template
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("HTML email sent successfully to: {}, subject: {}, template: {}", 
                    to, subject, templateName);
            return true;
        } catch (MessagingException e) {
            log.error("Error sending HTML email to: {}, subject: {}, template: {}", 
                    to, subject, templateName, e);
            return false;
        }
    }

    /**
     * Sends a notification email.
     *
     * @param notification The notification to send
     * @return true if the email was sent successfully, false otherwise
     */
    public boolean sendNotificationEmail(Notification notification) {
        // Prepare the template context
        Context context = new Context();
        context.setVariable("notification", notification);
        context.setVariable("recipientName", notification.getRecipientEmail().split("@")[0]);

        // Select the appropriate template based on notification type
        String templateName = getTemplateNameForNotificationType(notification.getType());

        return sendHtmlEmail(
                notification.getRecipientEmail(),
                notification.getTitle(),
                templateName,
                context
        );
    }

    /**
     * Gets the template name for a notification type.
     *
     * @param type The notification type
     * @return The template name
     */
    private String getTemplateNameForNotificationType(Notification.NotificationType type) {
        switch (type) {
            case ORDER_CONFIRMATION:
                return "email/order-confirmation";
            case ORDER_SHIPPED:
                return "email/order-shipped";
            case ORDER_DELIVERED:
                return "email/order-delivered";
            case ORDER_CANCELLED:
                return "email/order-cancelled";
            case ORDER_REFUNDED:
                return "email/order-refunded";
            case DROP_ANNOUNCEMENT:
                return "email/drop-announcement";
            case DROP_EARLY_ACCESS:
                return "email/drop-early-access";
            case DROP_LIVE:
                return "email/drop-live";
            case DROP_ENDING_SOON:
                return "email/drop-ending-soon";
            case STOCK_ALERT:
                return "email/stock-alert";
            case DELIVERY_UPDATE:
                return "email/delivery-update";
            case PROMOTION:
                return "email/promotion";
            case SYSTEM:
            default:
                return "email/system-notification";
        }
    }
}
