package com.retrorise.sharedkernel.kafka;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Kafka topics.
 * This class centralizes topic naming conventions across the application.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "kafka.topics")
public class KafkaTopicProperties {

    private String brandEvents = "brand.brand.events.v1";
    private String dropEvents = "drop.drop.events.v1";
    private String orderEvents = "order.order.events.v1";

    private int partitions = 3;
    private short replicationFactor = 1;

    // Dead Letter Queue suffix
    private String dlqSuffix = ".dlq";

    /**
     * Gets the DLQ topic name for a given topic.
     *
     * @param topic The original topic name
     * @return The DLQ topic name
     */
    public String getDlqTopic(String topic) {
        return topic + dlqSuffix;
    }
}
