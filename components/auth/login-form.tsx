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

const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
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
          {/* <Input
            type="email"
            placeholder="example@mail.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )} */}
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
        <FormSuccess message="" />
        <FormError message="" />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </CardWrapper>
  );
};

export default LoginForm;
