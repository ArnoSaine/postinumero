import {
  CONFIG,
  type StrategyType,
} from "@postinumero/react-router-formatjs/config";
import { cloneElement } from "react";
import { useFetcher } from "react-router";
import { useOptions } from "../options/useOptions.ts";
import { environmentNames } from "../options/values.ts";
import CurrentUrlHiddenInput from "./CurrentUrlHiddenInput.tsx";
import LocaleDisplayName from "./LocaleDisplayName.tsx";

export type OptionsSelectProps = Omit<
  React.ButtonHTMLAttributes<HTMLSelectElement>,
  "defaultValue"
> & {
  component?: React.ElementType;
  name: StrategyType;
  optionComponent?: React.ElementType<{ value: string }>;
  optionChildComponent?: React.ElementType<{ value: string }>;
  optionElement?: <T extends React.ReactElement<{ value: string }, "option">>(
    element: T,
    index?: number,
    elements?: T[],
  ) => T;
  options: readonly (string | null)[];
  defaultValue?: string | null;
};

export function OptionSelect({
  component: Component = "select",
  name,
  optionComponent: Option = "option",
  optionChildComponent: OptionChild,
  optionElement,
  options,
  ...props
}: OptionsSelectProps) {
  if (OptionChild) {
    optionElement = (element) =>
      cloneElement(
        element,
        undefined,
        <OptionChild {...element.props} />,
      ) as typeof element;
  }

  let optionElements = options.map((option) => (
    <Option
      key={option}
      value={
        option ?? "" // Use empty string for null. Otherwise the option children will be used as the value, which is incorrect.
      }
    >
      {option}
    </Option>
  ));

  if (optionElement) {
    optionElements = optionElements.map(optionElement);
  }

  const { Form, submit } = useFetcher();

  return (
    <Form
      onChange={(event) => {
        submit(event.currentTarget);
      }}
      method="POST"
      action={CONFIG.route.path}
    >
      <CurrentUrlHiddenInput />
      <Component
        // Remount the select when the default value changes
        key={props.defaultValue}
        name={CONFIG.strategyTypeKeys[name]}
        {...props}
      >
        {optionElements}
      </Component>
    </Form>
  );
}

type SelectProps = Omit<OptionsSelectProps, "name" | "options"> & {
  options?: OptionsSelectProps["options"];
};

export function EnvironmentSelect(props: SelectProps) {
  return (
    <OptionSelect
      name="environment"
      defaultValue={useOptions().environment}
      options={[null, ...environmentNames]}
      {...props}
    />
  );
}

export function LocaleSelect(props: SelectProps) {
  const options = useOptions();
  return (
    <OptionSelect
      name="requestedLocales"
      defaultValue={options.requestedLocale}
      options={[null, ...options.availableLocales]}
      optionChildComponent={LocaleDisplayName}
      {...props}
    />
  );
}
