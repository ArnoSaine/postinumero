import getCompiledMessages from "@postinumero/integration-react-intl-x-remix/getCompiledMessages";
import getMessages from "@postinumero/integration-react-intl-x-remix/getMessages";
import { LoaderFunctionArgs, json } from "@remix-run/node";

export default async function loadMessages(
  args: LoaderFunctionArgs,
  {
    loader,
    locale,
    routeFile,
  }: {
    loader;
    locale;
    routeFile?: string;
  }
) {
  const response = (await loader?.(args)) ?? {};

  const compiledMessages = await getCompiledMessages({ locale });
  const uncompiledMessages = await getMessages({ locale });

  const messages = routeFile
    ? Object.fromEntries(
        Object.entries(uncompiledMessages)
          .filter(([, message]: any) =>
            message.files.some(
              (file) => file === routeFile || file.startsWith(`${routeFile}/`)
            )
          )
          .map(([id]) => [id, compiledMessages[id]])
      )
    : Object.fromEntries(
        Object.entries(uncompiledMessages)
          .filter(([, message]: any) =>
            message.files.some((file) => !file.startsWith("app/routes/"))
          )
          .map(([id]) => [id, compiledMessages[id]])
      );

  if (response instanceof Response) {
    const data = await response.json();
    return json({ ...data, messages }, response);
  }

  return json({ ...response, messages });
}
