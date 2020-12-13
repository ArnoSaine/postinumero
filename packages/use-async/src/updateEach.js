export default function updateEach({ updaters }) {
  updaters.forEach((updater) => updater());
}
