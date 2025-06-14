import type { FormatNumberOptions } from "react-intl";

export function formatNumberBytesArgs(
  value: number,
  options: FormatNumberOptions,
): [number, FormatNumberOptions] {
  const units = [
    "byte",
    "kilobyte",
    "megabyte",
    "gigabyte",
    "terabyte",
    "petabyte",
  ];
  const base = 1024;

  if (value < 1) {
    return [value, { unit: "byte", ...options }];
  }

  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(base)),
    units.length - 1,
  );

  return [
    value / Math.pow(base, exponent),
    {
      unit: units[exponent],
      ...options,
    },
  ];
}
