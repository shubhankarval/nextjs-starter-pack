import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";

import { Button } from "@components/ui/button";

export async function AuthButton() {
  return (
    <>
      <SignedOut>
        <SignInButton oauthFlow="popup">
          <Button type="submit" className="flex items-center" size="sm">
            <span className="text-sm">Sign in</span>
            <LogIn className="size-4" />
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button
            variant="outline"
            type="submit"
            className="flex items-center gap-2"
            size="sm"
          >
            <span className="text-sm">Sign out</span>
            <LogOut className="size-4" />
          </Button>
        </SignOutButton>
      </SignedIn>
    </>
  );
}
