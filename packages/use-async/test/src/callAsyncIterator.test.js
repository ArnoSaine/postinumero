import recall from "@postinumero/use-async/lib/recall.js";
import useAsync from "@postinumero/use-async/lib/useAsync.js";
import { Repeater } from "@repeaterjs/repeater";
import { act, render, screen, waitFor } from "@testing-library/react";
import delay from "delay";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

test("get yielded values", async () => {
  async function* asyncGenerator() {
    let i = 0;
    while (i < 3) {
      await delay(500);
      yield i++;
    }
  }

  function C() {
    return useAsync(asyncGenerator);
  }

  const { queryByText } = render(
    <Suspense fallback="loading">
      <C />
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(queryByText("0")).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(queryByText("1")).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(queryByText("2")).toBeInTheDocument();
  });
});

test("get yielded value, then error", async () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => {});

  async function* asyncGenerator() {
    await delay(500);
    yield "foo";
    await delay(500);
    throw new Error("oops");
  }

  function C() {
    return useAsync(asyncGenerator);
  }

  const { getByText } = render(
    <Suspense fallback="loading">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <C />
      </ErrorBoundary>
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("foo")).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(getByText("oops")).toBeInTheDocument();
  });
  spy.mockRestore();
});

function ErrorFallback({ error }) {
  return error.message;
}

test("leave running if mounted", async () => {
  const stopped = jest.fn();
  const stoppable = () =>
    new Repeater(async (push, stop) => {
      push("foo");
      await stop;
      stopped();
    });

  function C() {
    return useAsync(stoppable);
  }

  const { getByText } = render(
    <Suspense fallback="loading">
      <C />
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("foo")).toBeInTheDocument();
  });
  await delay(1500);
  expect(stopped).not.toBeCalled();
});

test("stop on unmount", async () => {
  const stopped = jest.fn();
  const stoppable = () =>
    new Repeater(async (push, stop) => {
      push("foo");
      await stop;
      stopped();
    });

  function C() {
    return useAsync(stoppable);
  }

  const { getByText, rerender } = render(
    <Suspense fallback="loading">
      <C />
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("foo")).toBeInTheDocument();
  });
  rerender(<Suspense fallback="loading">done</Suspense>);
  screen.getByText("done");
  await delay(500);
  expect(stopped).toBeCalledTimes(1);
});

test("rerun on params change and on recall", async () => {
  const counter = jest.fn();
  async function* asyncGenerator(x) {
    counter();
    yield 2 * x;
  }

  function C({ x }) {
    return useAsync(asyncGenerator, [x]);
  }

  const { getByText, rerender } = render(
    <Suspense fallback="loading">
      <C x={1} />
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("2")).toBeInTheDocument();
  });
  rerender(
    <Suspense fallback="loading">
      <C x={2} />
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("4")).toBeInTheDocument();
  });
  expect(counter).toBeCalledTimes(2);
  await act(async () => {
    await recall(asyncGenerator, [2]);
  });
  expect(counter).toBeCalledTimes(3);
});
