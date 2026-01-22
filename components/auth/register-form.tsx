"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { register } from "@/actions/register";
import { RegisterSchema } from "@/schemas";
import { useState, useTransition } from "react";

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await register(values);

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
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Name</label>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <>
                <Input type="name" placeholder="John Doe" {...field} />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

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
        {/* Password */}
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
          Register
        </Button>
      </form>
    </CardWrapper>
  );
};

export default RegisterForm;
