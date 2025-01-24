export type HttpResponseAssertion = (
  condition: unknown,
  body?: ConstructorParameters<typeof Response>[0],
) => asserts condition;

export function createHttpResponseAssertion(
  status: number,
): HttpResponseAssertion {
  return function (
    condition: unknown,
    body?: ConstructorParameters<typeof Response>[0],
  ): asserts condition {
    if (!condition) {
      throw new Response(body, {
        status,
      });
    }
  };
}

export const authorized: HttpResponseAssertion =
  createHttpResponseAssertion(401);

export const allowed: HttpResponseAssertion = createHttpResponseAssertion(403);
