import useAsync from "@postinumero/use-async/lib/useAsync.js";
import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

async function success(h) {
  return "foo";
}

function Success() {
  return useAsync(success);
}

test("suspend, then render value", async () => {
  const { getByText } = render(
    <>
      <Suspense fallback="loading">
        <Success />
      </Suspense>
    </>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("foo")).toBeInTheDocument();
  });
});

test("render available value immediately", async () => {
  const { getByText, rerender } = render(
    <Suspense fallback="loading">
      <Success />
    </Suspense>
  );
  await waitFor(() => {
    expect(getByText("foo")).toBeInTheDocument();
  });

  rerender(
    <Suspense fallback="loading">
      <Success />
      <Success />
    </Suspense>
  );
  expect(getByText("foofoo")).toBeInTheDocument();
});

async function throwError() {
  throw new Error("oops");
}

function ThrowError() {
  return useAsync(throwError);
}

test("suspend, then render error", async () => {
  const spy = jest.spyOn(console, "error");
  spy.mockImplementation(() => {});

  const { getByText } = render(
    <Suspense fallback="loading">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThrowError />
      </ErrorBoundary>
    </Suspense>
  );
  screen.getByText("loading");
  await waitFor(() => {
    expect(getByText("oops")).toBeInTheDocument();
  });
  spy.mockRestore();
});

function ErrorFallback({ error }) {
  return error.message;
}
