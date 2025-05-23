import { createEvent, createEventEmitter } from "~/core/src/main";
import { describe, it, expect, vi } from "vitest";

describe("Core", () => {
  describe("Synthetic Events", () => {
    it("should create and emit basic event without payload", () => {
      const { on } = createEventEmitter();
      const event = createEvent<void>();
      const handler = vi.fn();

      on(event, handler);
      event();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(null);
    });

    it("should create and emit event with string payload", () => {
      const { on } = createEventEmitter();
      const stringEvent = createEvent<string>();
      const handler = vi.fn();
      const __PAYLOAD = "Hello, World!";

      on(stringEvent, handler);
      stringEvent(__PAYLOAD);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(__PAYLOAD);
    });

    it("should create and emit event with object payload", () => {
      type Payload = {
        id: number;
        message: string;
        active: boolean;
      };

      const { on } = createEventEmitter();
      const objectEvent = createEvent<Payload>();
      const handler = vi.fn();
      const __PAYLOAD: Payload = {
        id: 42,
        message: "Test message",
        active: true,
      };

      on(objectEvent, handler);
      objectEvent(__PAYLOAD);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(__PAYLOAD);
      expect(handler.mock.calls[0][0]).toEqual(__PAYLOAD);
    });

    it("should handle multiple subscribers for the same event", () => {
      const { on } = createEventEmitter();
      const multiEvent = createEvent<number>();
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const __PAYLOAD = 123;

      on(multiEvent, handler1);
      on(multiEvent, handler2);
      multiEvent(__PAYLOAD);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenCalledWith(__PAYLOAD);
      expect(handler2).toHaveBeenCalledWith(__PAYLOAD);
    });

    it("should handle multiple emissions of the same event", () => {
      const { on } = createEventEmitter();
      const repeatEvent = createEvent<string>();
      const handler = vi.fn();

      on(repeatEvent, handler);
      repeatEvent("first");
      repeatEvent("second");
      repeatEvent("third");

      expect(handler).toHaveBeenCalledTimes(3);
      expect(handler).toHaveBeenNthCalledWith(1, "first");
      expect(handler).toHaveBeenNthCalledWith(2, "second");
      expect(handler).toHaveBeenNthCalledWith(3, "third");
    });

    it("should work with different payload types", () => {
      const { on } = createEventEmitter();
      const numberEvent = createEvent<number>();
      const booleanEvent = createEvent<boolean>();
      const nullEvent = createEvent<null>();

      const numberHandler = vi.fn();
      const booleanHandler = vi.fn();
      const nullHandler = vi.fn();

      on(numberEvent, numberHandler);
      on(booleanEvent, booleanHandler);
      on(nullEvent, nullHandler);

      numberEvent(42);
      booleanEvent(true);
      nullEvent(null);

      expect(numberHandler).toHaveBeenCalledWith(42);
      expect(booleanHandler).toHaveBeenCalledWith(true);
      expect(nullHandler).toHaveBeenCalledWith(null);
    });
  });

  describe("Native Browser Events", () => {
    it("should handle window events", () => {
      const { on } = createEventEmitter();
      const handler = vi.fn();
      const __EVENT_TYPE = "window:resize";

      const originalAddEventListener = window.addEventListener;
      window.addEventListener = vi.fn();

      on(__EVENT_TYPE, handler);

      expect(window.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );

      window.addEventListener = originalAddEventListener;
    });

    it("should handle document events", () => {
      const { on } = createEventEmitter();
      const handler = vi.fn();
      const __EVENT_TYPE = "document:click";

      const originalAddEventListener = document.addEventListener;
      document.addEventListener = vi.fn();

      on(__EVENT_TYPE, handler);

      expect(document.addEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function),
      );

      document.addEventListener = originalAddEventListener;
    });

    it("should correctly parse and handle window keydown events", () => {
      const { on } = createEventEmitter();
      const handler = vi.fn();
      const __EVENT_TYPE = "window:keydown";

      const originalAddEventListener = window.addEventListener;
      const mockAddEventListener = vi.fn();
      window.addEventListener = mockAddEventListener;

      on(__EVENT_TYPE, handler);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      const registeredHandler = mockAddEventListener.mock.calls[0][1];
      const mockKeyboardEvent = new KeyboardEvent("keydown", { key: "Enter" });

      registeredHandler(mockKeyboardEvent);

      expect(handler).toHaveBeenCalledWith(mockKeyboardEvent);

      window.addEventListener = originalAddEventListener;
    });
  });

  describe("Type Safety", () => {
    it("should enforce correct synthetic event payload types", () => {
      const { on } = createEventEmitter();
      const stringEvent = createEvent<string>();
      const numberEvent = createEvent<number>();

      const stringHandler = vi.fn<[string], void>();
      const numberHandler = vi.fn<[number], void>();

      on(stringEvent, stringHandler);
      on(numberEvent, numberHandler);

      stringEvent("test");
      numberEvent(42);

      expect(stringHandler).toHaveBeenCalledWith("test");
      expect(numberHandler).toHaveBeenCalledWith(42);
    });

    it("should work with complex payload types", () => {
      type ComplexPayload = {
        user: { id: number; name: string };
        metadata: { timestamp: number; source: string };
        flags: boolean[];
      };

      const { on } = createEventEmitter();
      const complexEvent = createEvent<ComplexPayload>();
      const handler = vi.fn<[ComplexPayload], void>();
      const __PAYLOAD: ComplexPayload = {
        user: { id: 1, name: "John" },
        metadata: { timestamp: Date.now(), source: "test" },
        flags: [true, false, true],
      };

      on(complexEvent, handler);
      complexEvent(__PAYLOAD);

      expect(handler).toHaveBeenCalledWith(__PAYLOAD);
      expect(handler.mock.calls[0][0].user.name).toBe("John");
      expect(handler.mock.calls[0][0].flags).toHaveLength(3);
    });
  });
});
