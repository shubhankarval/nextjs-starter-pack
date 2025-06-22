import { LogIn, LogOut } from "lucide-react";

import { auth, signIn, signOut } from "@lib/auth";
import { Button } from "@components/ui/button";

export async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button
          variant="outline"
          type="submit"
          className="flex items-center gap-2"
          size="sm"
        >
          <span className="text-sm">Sign out</span>
          <LogOut className="size-4" />
        </Button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <Button type="submit" className="flex items-center" size="sm">
        <span className="text-sm">Sign in</span>
        <LogIn className="size-4" />
      </Button>
    </form>
  );
}
