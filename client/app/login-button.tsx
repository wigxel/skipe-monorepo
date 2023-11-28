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

export function LoginButton() {
  const [isLogin, set] = React.useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>LOGIN</Button>
      </DialogTrigger>

      <DialogOverlay>
        <DialogContent className={"px-16 py-12 !rounded-2xl"}>
          <DialogTitle
            className={
              "text-3xl font-display text-center tracking-tighter font-bold"
            }
          >
            {isLogin ? "Welcome back" : "Get started"}
          </DialogTitle>

          {isLogin ? <LoginForm /> : <SignupForm />}

          <div
            className={"p-4 rounded-full hover:bg-gray-50 text-sm text-center"}
          >
            <span className={"text-muted-foreground"}>
              {isLogin ? "Already have an account?" : "Don't have an account?"}
            </span>
            <Button
              variant={"link"}
              className={"w-auto text-secondary"}
              onClick={() => set((e) => !e)}
            >
              {isLogin ? "Create account" : "Login"}
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
