import { useCallback, useState } from "react";
import { trpcApi } from "./context/trpc";

export const App = () => {
  const [name, setName] = useState<string | undefined>("Electron");
  const { mutateAsync } = trpcApi.greeting.useMutation({
    onSuccess: (data) => data.text,
  });
  const [resp, setResp] = useState<string | undefined>(undefined);

  const greet = useCallback(async () => {
    console.log("[SENDING]", window.__id, name);
    const response = await mutateAsync({ clientId: window.__id, name });
    setResp(response.text);
  }, [mutateAsync, name]);

  trpcApi.subscription.useSubscription(undefined, {
    enabled: true,
    onStarted: () => console.log("[STARTED]", window.__id),
    onData: (subscriptionResp) =>
      console.log("[RECEIVED]", window.__id, subscriptionResp),
  });

  return (
    <div className="w-screen h-screen p-5">
      <div className="flex flex-col gap-5 p-5">
        <input
          type="text"
          className="border border-black p-1 rounded-md"
          value={name ?? ""}
          onChange={(e) => {
            const newVal = e.target.value;
            setName(newVal === "" ? undefined : newVal);
          }}
        />
        <button onClick={greet}>Greet!</button>
        <div className="greeting">{resp ? resp : "Not greeted yet..."}</div>
      </div>
    </div>
  );
};
