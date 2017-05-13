import { _ } from "oly-core";
import { attachKernel } from "oly-test";
import { task } from "../src/decorators/task";
import { IMessage } from "../src/interfaces";
import { AmqpProvider } from "../src/providers/AmqpProvider";
import { WorkerProvider } from "../src/providers/WorkerProvider";

class Tasks {
  static stack: IMessage[] = [];

  @task("abc.queue")
  abc(message: IMessage) {
    Tasks.stack.push(message);
  }
}

describe("AmqpProvider", () => {
  const kernel = attachKernel().with(WorkerProvider, Tasks);
  const amqp = kernel.get(AmqpProvider);

  it("should publish a message", async () => {
    await amqp.purge("abc.queue");
    await amqp.publish("abc.queue", "Hello");
    await _.timeout(100);
    expect(Tasks.stack.length).toBe(1);
    expect(Tasks.stack[0].properties.correlationId).toBe(kernel.id);
    expect(Tasks.stack[0].content.toString("UTF-8")).toBe("Hello");
  });
});