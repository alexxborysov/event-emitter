import { createEvent, createEventEmitter } from "~/core/src/main";
import { describe, it, expectTypeOf } from "vitest";

describe("Types", () => {
  it("should pass corect synthetic event payload type", () => {
    type Payload = { id: string };

    const { on } = createEventEmitter();
    const event = createEvent<Payload>();

    on(event, (payload) => {
      expectTypeOf(payload).toEqualTypeOf<Payload>();
    });
  });

  it("should pass void synthetic event payload type", () => {
    const { on } = createEventEmitter();
    const event = createEvent();

    on(event, (payload) => {
      expectTypeOf(payload).toEqualTypeOf<void>();
    });
  });

  it("should pass MouseEvent payload type", () => {
    const { on } = createEventEmitter();
    on("document:click", (payload) => {
      expectTypeOf(payload).toEqualTypeOf<MouseEvent>();
    });
  });
});
