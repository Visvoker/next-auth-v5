"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await login(values);

        if (data?.error) {
          form.reset();
          setError(data.error);
          return;
        }

        if (data?.success) {
          form.reset();
          setShowTwoFactor(false);
          setSuccess(data.success);
          return;
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      } catch (error) {
        setError("Something went wrong");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/auth/register"
      showSocial
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <>
          {showTwoFactor && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Two Factor Code</label>
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="123456"
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}
          {!showTwoFactor && (
            <>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Email</label>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Password</label>
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                      <Button
                        className="px-0 font-normal self-start"
                        size="sm"
                        variant="link"
                        asChild
                      >
                        <Link href="/auth/reset">forgot password?</Link>
                      </Button>
                    </>
                  )}
                />
              </div>
            </>
          )}
        </>

        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          {showTwoFactor ? "Confirm" : "Login"}
        </Button>
      </form>
    </CardWrapper>
  );
};

export default LoginForm;
