"use client";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/Button";
import React from "react";
import { LoginForm } from "~/app/login-form";
import { SignupForm } from "~/app/signup-form";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuth } from "~/hooks/use-auth";
import { ChevronDown } from "lucide-react";
import { signIn, signOut } from "~/lib/auth.helpers";

export function LoginButton() {
  const [is_login_intent, set] = React.useState(true);
  const { is_logged_in, user } = useAuth();

  return (
    <Dialog>
      {is_logged_in ? (
        <DialogTrigger asChild>
          <Button>LOGIN</Button>
        </DialogTrigger>
      ) : (
        <div className="flex items-stretch space-x-2">
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <AuthDropdown>
            <DropdownMenuTrigger className="flex items-center space-x-1 outline-none">
              <span className="font-body">{user.first_name}</span>
              <ChevronDown size="0.874rem" />
            </DropdownMenuTrigger>
          </AuthDropdown>
        </div>
      )}

      <DialogOverlay>
        <DialogContent className={"px-16 py-12 !rounded-2xl"}>
          <DialogTitle
            className={
              "text-3xl font-display text-center tracking-tighter font-bold"
            }
          >
            {is_login_intent ? "Welcome back" : "Get started"}
          </DialogTitle>

          {is_login_intent ? <LoginForm /> : <SignupForm />}

          <div
            className={"p-4 rounded-full hover:bg-gray-50 text-sm text-center"}
          >
            <span className={"text-muted-foreground"}>
              {!is_login_intent
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>
            <Button
              variant={"link"}
              className={"w-auto text-secondary"}
              onClick={() => set((e) => !e)}
            >
              {is_login_intent ? "Create account" : "Login"}
            </Button>
          </div>

          <button type="button" onClick={() => signIn()}>
            Simple Sign In
          </button>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

function AuthDropdown(props: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      {props.children}

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
