## Description

I was looking for an example to demonstrate to some team members how you can use nestjs with kafka but i haven't been able to find an example and nest documentation regarding the microservices module and kafka are not so great... so i've compiled the following example and you are free to download and test it.

If you need also to setup kafka on your machine i've created also a docker compose file including some commands to handle the topics, publish messages and more.

It is available over here : [kafka-docker-sample](https://github.com/israelio/kafka-docker-sample)

## I wana see it working first
* Download the [docker sample](https://github.com/israelio/kafka-docker-sample) and run the start command
```
$ git clone git@github.com:israelio/kafka-docker-sample.git

$ chmod +x make-commands-executable.sh

$ ./start
```
* Create a kafka topic
```
$ ./kafka/topic/create entity-created
```
* Publish a message to this topic
```
# each line is a new message, click ctrl-c to end.

$ ./kafka/message/produce entity-created
```

* Clone this repo
```
$ git clone git@github.com:israelio/nestjs-kafka-example.git
```
* Install the project dependencies i.e. run npm install
```
$ npm i
```
* Run the project
```
$ npm start
```
* once you will run the project you should see the message that you published appears at the console

## I want to understand what to do in my project

* Prepare a confiuration class with the kafka configuration
```javascript
// microserviceConfig.ts
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
```

* Init the nest js microservices module in the bootstrap
```javascript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microserviceConfig);

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
```

* Declare the ClientKafka which will allow you also to send messages
* Iherit from OnModuleInit and implement the onModuleInit where you will subscribe the controller to the target topic and to the message handler
* Declare a message handler for the payload and decorate it with the EventPattern which includes the topic name
```javascript
@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  @Client(microserviceConfig)
  client: ClientKafka;


  onModuleInit() {
    const requestPatterns = [
      'entity-created',
    ];

    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('entity-created')
  async handleEntityCreated(payload: any) {
    console.log(JSON.stringify(payload) + ' created');
  }
}
```
* If you want to fire events to kafka from your controller use the client emit function
```javascript
  // fire event to kafka
  this.client.emit<string>('entity-created', 'some entity ' + new Date());

```

## nestjs-kafka-example
