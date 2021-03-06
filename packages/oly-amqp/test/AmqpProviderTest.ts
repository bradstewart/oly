import { _, Exception, Kernel } from "oly";
import { content } from "../src";
import { task } from "../src/decorators/task";
import { IMessage } from "../src/interfaces";
import { AmqpProvider } from "../src/providers/AmqpProvider";
import { WorkerProvider } from "../src/providers/WorkerProvider";
import { AmqpClient } from "../src/services/AmqpClient";

describe("AmqpProvider", () => {

  class Tasks {
    static stack: IMessage[] = [];
    static stack2: string[] = [];

    @task
    abc(@content test: string, message: IMessage) {
      this.processMessage(test, message);
    }

    @task("withName")
    abc2(@content test: string, message: IMessage) {
      this.processMessage(test, message);
    }

    processMessage(test: string, message: IMessage) {
      Tasks.stack2.push(test);
      if (Tasks.stack.length === 1) {
        throw new Exception("boom");
      }
      Tasks.stack.push(message);
    }
  }

  Kernel.create().with(WorkerProvider, Tasks);

  const kernel = Kernel.create();
  const client = kernel.inject(AmqpClient);

  it("should publish messages", async () => {
    await client.purge("Tasks.abc");
    await client.publish("Tasks.abc", "Hello");
    await client.publish("withName", "Hello");
    await _.timeout(500);
    expect(Tasks.stack.length).toBe(1);
    expect(Tasks.stack[0].properties.correlationId).toBe(kernel.id);
    expect(Tasks.stack[0].content.toString("UTF-8")).toBe("Hello");
    expect(Tasks.stack2[0]).toBe("Hello");
    expect(Tasks.stack2[1]).toBe("Hello");
  });
});
