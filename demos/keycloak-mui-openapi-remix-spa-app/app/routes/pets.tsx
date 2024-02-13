import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  ClientActionFunctionArgs,
  Form,
  json,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { petApi } from "~/api";
import { authenticated, realmAccess } from "~/auth/helpers";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  await authenticated(realmAccess("admin"));

  const formData = await request.formData();
  const name = String(formData.get("name"));

  await petApi.addPet({
    pet: {
      id: Math.floor(Math.random() * 10000 + 10000),
      name,
      photoUrls: [],
      category: {
        id: 1,
        name: "Dogs",
      },
      tags: [],
      status: "available",
    },
  });

  return null;
};

export const clientLoader = async () => {
  await authenticated();

  const pets = await petApi.findPetsByStatus({ status: "available" });

  return json({ pets });
};

export default function Pets() {
  const { pets } = useLoaderData<typeof clientLoader>();

  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isIdle) {
      formRef.current?.reset();
    }
  }, [isIdle]);

  return (
    <>
      <Typography variant="h2">Pets</Typography>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name}</li>
        ))}
      </ul>
      <Form method="POST" ref={formRef}>
        <TextField name="name" type="text" />
      </Form>
      <Link href="/">Go to the main page</Link>
    </>
  );
}
