# event-emitter

```plaintext
pnpm add allex.event-emitter
```

```ts
const { on } = createEventEmitter();
const domainEvent = createEvent<Payload>();

on(domainEvent, (payload) => { /* typed with Payload */ });
on("window:click", (payload) => { /* typed with MouseEvent */ });
on("window:offline", () => { .. });

domainEvent(payload);
```
