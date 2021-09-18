import type { Fn, Memoized } from '.';

export default function updateEach<Func extends Fn>({
  updaters,
}: Memoized<Func>) {
  updaters.forEach((updater) => updater());
}
