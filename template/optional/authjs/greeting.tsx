"use client";

import { useEffect, useState } from "react";
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
  const [greeting, setGreeting] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchGreeting = async () => {
      let name = "";
      if (session?.user?.name) {
        name = " " + session.user.name.split(" ")[0];
      }

      try {
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
          const res = await fetch(
            `https://hellosalut.stefanbohacek.dev/?${params}`
          );
          const data: HelloResponse = await res.json();
          setGreeting(he.decode(data.hello) + name + "!");
        } else {
          setGreeting("Hello" + name + "!");
        }
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
        setGreeting("Hello" + name + "!");
      }
    };

    fetchGreeting();
  }, [session]);

  return (
    <h1 className="text-foreground text-2xl font-bold">
      {greeting?.length && greeting}
    </h1>
  );
}

export function Greeting() {
  return (
    <SessionProvider>
      <RenderGreeting />
    </SessionProvider>
  );
}
