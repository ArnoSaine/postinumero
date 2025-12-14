export const options = {
  redirectURI: {
    name: "redirect_uri",
  },
};

export const getRedirectURI = (searchParams: URLSearchParams) =>
  searchParams.get(options.redirectURI.name);

export const setRedirectURI = (
  searchParams: URLSearchParams,
  value: string | null,
) =>
  value
    ? searchParams.set(options.redirectURI.name, value)
    : searchParams.delete(options.redirectURI.name);

export const redirectURISearchParams = (value?: string | null) =>
  value ? `?${new URLSearchParams([[options.redirectURI.name, value]])}` : "";
