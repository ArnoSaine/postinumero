import {
  environmentNames,
  EnvironmentSelect,
  FormattedMessageValue,
  LocaleSelect,
  SetEnvironmentButton,
  SetLocaleButton,
  useOptions,
} from "@postinumero/react-router-formatjs";
import { defineMessages, FormattedMessage } from "react-intl";
import { Form } from "react-router";

export default function EnvironmentAndLocaleSelectors() {
  const { availableLocales } = useOptions();

  return (
    <>
      <ul className="flex flex-row gap-4 p-4">
        {[null, ...environmentNames].map((environment) => (
          <li key={environment}>
            <SetEnvironmentButton value={environment} component={Button}>
              <EnvironmentDisplayName value={environment} />
            </SetEnvironmentButton>
          </li>
        ))}
      </ul>
      <ul className="flex flex-row gap-4 p-4">
        {[null, ...availableLocales].map((locale) => (
          <li key={locale}>
            <SetLocaleButton value={locale} component={Button} />
          </li>
        ))}
      </ul>
      <div className="flex flex-row gap-4 p-4">
        <EnvironmentSelect
          component={Select}
          optionChildComponent={EnvironmentDisplayName}
        />
        <LocaleSelect component={Select} />
      </div>
      <div className="flex flex-row gap-4 p-4">
        <Form navigate={false} method="post">
          <Button>
            <FormattedMessage
              defaultMessage="Test action"
              description="Test action button"
            />
          </Button>
        </Form>
      </div>
    </>
  );
}

function EnvironmentDisplayName({ value }: { value: string | null }) {
  return value ? (
    <FormattedMessageValue
      messages={defineMessages({
        "com.acme.test": {
          defaultMessage: "ACME (test)",
          description: "Environment name: com.acme.test",
        },
        "com.acme": {
          defaultMessage: "ACME",
          description: "Environment name: com.acme",
        },
        "com.example.test": {
          defaultMessage: "Example.com (test)",
          description: "Environment name: com.example.test",
        },
        "com.example": {
          defaultMessage: "Example.com",
          description: "Environment name: com.example",
        },
        production: {
          defaultMessage: "Production",
          description: "Environment name: production",
        },
      })}
      messageKey={value}
    />
  ) : (
    <FormattedMessage defaultMessage="Base" description="Base environment" />
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`p-2 rounded bg-gray-200
disabled:bg-gray-300
hover:bg-gray-300
hover:enabled:cursor-pointer
dark:bg-gray-700
dark:disabled:bg-gray-600
dark:hover:bg-gray-600`}
      {...props}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`p-2 rounded bg-gray-200
disabled:bg-gray-300
hover:bg-gray-300
hover:enabled:cursor-pointer
dark:bg-gray-700
dark:disabled:bg-gray-600
dark:hover:bg-gray-600`}
      {...props}
    />
  );
}
