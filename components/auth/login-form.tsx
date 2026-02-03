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

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
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
          setSuccess(data.success);
          return;
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
                <Input type="password" placeholder="••••••••" {...field} />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </CardWrapper>
  );
};

export default LoginForm;
