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
import { ResetSchema } from "@/schemas";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await reset(values);

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
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
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

        <FormError message={error} />
        <FormSuccess message={success} />
        <Button type="submit" className="w-full">
          Send reset email
        </Button>
      </form>
    </CardWrapper>
  );
};

export default ResetForm;
