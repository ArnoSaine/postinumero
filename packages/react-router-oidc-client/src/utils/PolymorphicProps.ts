import { type ComponentProps, type ElementType } from "react";

export type PolymorphicProps<C extends ElementType> = {
  component?: C;
} & ComponentProps<C>;
