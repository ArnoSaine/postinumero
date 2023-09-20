import create from "@postinumero/use-async/lib/loading-state/create.js";
import { render, screen, waitFor } from "@testing-library/react";

const f = jest.fn();

const [useF, recallF, useFSafe] = create(f);

function Foo() {
  const { isLoading } = useF();
  return isLoading ? "loading" : "foo";
}

function FooSafe() {
  const { isLoading } = useFSafe();
  return isLoading ? "loading" : "foo safe";
}

test("use created shortcuts", async () => {
  const { getByText } = render(
    <>
      <Foo />
      <FooSafe />
    </>
  );
  screen.getByText("loadingloading");
  await waitFor(() => {
    expect(getByText("foofoo safe")).toBeInTheDocument();
  });
  expect(f).toHaveBeenCalledTimes(1);
  recallF();
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(2);
  });
});
