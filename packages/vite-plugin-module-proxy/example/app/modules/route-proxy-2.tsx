import Original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/route";

export default function Component() {
  return (
    <div style={{ border: "4px solid SkyBlue", margin: 4 }}>
      {Original && <Original />}
    </div>
  );
}
