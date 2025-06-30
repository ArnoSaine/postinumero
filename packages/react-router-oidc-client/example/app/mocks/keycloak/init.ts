if (typeof document === "undefined") {
  // TODO: Fix SSR https://github.com/mswjs/msw/issues/1657
  // const { server } = await import('./node');
  // server.listen();
} else {
  const { worker } = await import("./browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });
}

// For top level await
export {};
