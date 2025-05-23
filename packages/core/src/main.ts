import {
  is_string,
  is_synthetic_emitter,
  parse_browser_emitter,
} from "./guards";

const event_target = new EventTarget();
const synthetic_event_keys_storage = new WeakMap<
  SyntheticEventEmitter<any>,
  string
>();

export const browser_event_target_map = {
  window,
  document,
} as const;

export function createEvent<
  T extends ValidSyntheticEventPayload | void = void,
>() {
  const key = crypto.randomUUID();

  function emitter(payload: T) {
    event_target.dispatchEvent(new CustomEvent(key, { detail: payload }));
  }
  synthetic_event_keys_storage.set(emitter as SyntheticEventEmitter<T>, key);

  return emitter as SyntheticEventEmitter<T>;
}

export function createEventEmitter() {
  return {
    on: <E extends SyntheticEventEmitter<any> | NativeEventEmitter>(
      event_emitter: E,
      handler: (payload: ExtractEventPayload<E>) => void,
    ) => {
      if (is_synthetic_emitter(event_emitter)) {
        const key = synthetic_event_keys_storage.get(event_emitter);
        if (key) {
          event_target.addEventListener(key, (ev) =>
            handler((ev as CustomEvent).detail),
          );
        }
      } else if (is_string(event_emitter)) {
        const { target, event } = parse_browser_emitter(event_emitter);
        browser_event_target_map[target].addEventListener(event, (ev: Event) =>
          handler(ev as ExtractEventPayload<Event>),
        );
      }
    },
  };
}

/*
 * Synthetic Event definition
 * */
export type SyntheticEventEmitter<
  P extends ValidSyntheticEventPayload | void = void,
> = Tag<(payload: P) => void, "synthetic_event_emitter">;
export type ValidSyntheticEventPayload = any;

/*
 * Native Browser Event definition
 * */
export type NativeEventEmitter =
  | `window:${keyof WindowEventMap}`
  | `document:${keyof DocumentEventMap}`;

export type NativeEventTargetMap<E extends NativeEventsMap> = {
  window: WindowEventMap[E];
  document: DocumentEventMap[E];
};

export type NativeEventTarget = "window" | "document";
export type NativeEventsMap = keyof DocumentEventMap & keyof WindowEventMap;

/*
 * Event payloads
 * */
export type ExtractEventPayload<E> =
  E extends SyntheticEventEmitter<any>
    ? ExtractSyntheticEventPayload<E>
    : E extends NativeEventEmitter
      ? ExtractBrowserEventPayload<E>
      : never;

export type ExtractSyntheticEventPayload<E> =
  E extends SyntheticEventEmitter<infer P> ? P : never;

export type ExtractBrowserEventPayload<E> = E extends NativeEventEmitter
  ? DefineBrowserEventPayload<E>
  : never;

export type DefineBrowserEventPayload<Emitter extends NativeEventEmitter> =
  Emitter extends `${infer T extends NativeEventTarget}:${infer E extends NativeEventsMap}`
    ? NativeEventTargetMap<E>[T]
    : never;
