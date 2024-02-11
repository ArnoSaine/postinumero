import type { MetaFunction } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  Form,
  json,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { PetApi } from "~/api";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const petApi = new PetApi();

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
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
  const pets = await petApi.findPetsByStatus({ status: "available" });

  return json({ pets });
};

export default function Index() {
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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Pets</h1>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name}</li>
        ))}
      </ul>
      <Form method="POST" ref={formRef}>
        <input name="name" type="text" />
      </Form>
    </div>
  );
}
