import { Form } from "react-router";
import { CONFIG, useOptions, type StrategyType } from "../options.ts";
import LocaleDisplayName from "./LocaleDisplayName.tsx";

export type SetOptionButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> & {
  component?: React.ElementType;
  name: StrategyType;
  value: string | null;
};

export function SetOptionButton({
  component: Component = "button",
  name,
  ...props
}: SetOptionButtonProps) {
  return (
    <Form navigate={false} method="POST" action={CONFIG.route.path}>
      <Component
        name={CONFIG.strategyTypeKeys[name]}
        children={props.value}
        {...props}
      />
    </Form>
  );
}

type SetButtonProps = Omit<SetOptionButtonProps, "name">;

export function SetEnvironmentButton(props: SetButtonProps) {
  return (
    <SetOptionButton
      name="environment"
      disabled={useOptions().environment === props.value}
      {...props}
    />
  );
}

export function SetLocaleButton(props: SetButtonProps) {
  return (
    <SetOptionButton
      name="requestedLocales"
      disabled={useOptions().requestedLocale === props.value}
      children={<LocaleDisplayName value={props.value} />}
      {...props}
    />
  );
}
