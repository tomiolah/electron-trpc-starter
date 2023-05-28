import { observable } from "@trpc/server/observable";
import EventEmitter from "events";

class SingletonEmitter extends EventEmitter {
  static instance: SingletonEmitter;

  static getInstance(): SingletonEmitter {
    if (!SingletonEmitter.instance) {
      SingletonEmitter.instance = new SingletonEmitter();
    }
    return SingletonEmitter.instance;
  }
}

export function createSubscription<Data = unknown>(name: string) {
  function fire(data: Data) {
    SingletonEmitter.getInstance().emit(name, data);
  }

  function getListener() {
    return observable<Data>((emit) => {
      // Emit data to the client
      function onEvent(data: Data) {
        emit.next(data);
      }

      SingletonEmitter.getInstance().on(name, onEvent);

      return () => {
        SingletonEmitter.getInstance().removeListener(name, onEvent);
      };
    });
  }

  return { fire, getListener, emitter: SingletonEmitter.getInstance() };
}
