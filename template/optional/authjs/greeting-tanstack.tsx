"use client";

import { useQuery } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import he from "he";

type HelloResponse = {
  code: string;
  hello: string;
};

type IPResponse = {
  ip: string;
};

function RenderGreeting() {
  const { data: session } = useSession();
  const name = session?.user?.name ? ` ${session.user.name.split(" ")[0]}` : "";
  const {
    data: greeting,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["greeting", name],
    queryFn: () => fetchGreeting(name),
  });

  return (
    <h1 className="text-foreground text-2xl font-bold">
      {!isPending && (isError ? "Hello" + name + "!" : greeting)}
    </h1>
  );
}

async function fetchGreeting(name: string): Promise<string> {
  const params = new URLSearchParams();
  const langCode = navigator.language;

  if (langCode) {
    params.set("lang", langCode.startsWith("en") ? "en" : langCode);
  } else {
    const ipRes = await fetch("https://get.geojs.io/v1/ip.json");
    const ipData: IPResponse = await ipRes.json();
    if (ipData.ip) {
      params.set("ip", ipData.ip);
    }
  }

  if (params.size) {
    const res = await fetch(`https://hellosalut.stefanbohacek.dev/?${params}`);
    const data: HelloResponse = await res.json();
    return he.decode(data.hello) + name + "!";
  }

  return "Hello" + name + "!";
}

export function Greeting() {
  return (
    <SessionProvider>
      <RenderGreeting />
    </SessionProvider>
  );
}
