import {KafkaOptions, Transport} from "@nestjs/microservices";

export const microserviceConfig: KafkaOptions = {
    transport: Transport.KAFKA,

    options: {
        client: {
            brokers: ["127.0.0.1:9092"],
        },
        consumer: {
            groupId: '1',
            allowAutoTopicCreation: true,
        },
    }
};
