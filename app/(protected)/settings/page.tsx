"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import { settings } from "@/actions/settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { SettingsSchema } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";

import { UserRole } from "@/app/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

const SettingPage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  console.log(user);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: undefined,
      newPassword: undefined,
      role: user?.role,
      isTwoFactorEnabled: false,
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      name: user.name ?? "",
      email: user.email ?? "",
      role: user.role ?? UserRole.USER,
      isTwoFactorEnabled: user.isTwoFactorEnabled ?? false,
    });
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    // startTransition 的 callback 不能 async
    startTransition(() => {
      void handleSubmit(values);
    });
  };

  const handleSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    try {
      // ✅ 如果你有做 normalize（"" -> undefined），在這裡做最乾淨
      const payload: z.infer<typeof SettingsSchema> = {
        ...values,
        name: values.name?.trim() || undefined,
        email: values.email?.trim() || undefined,
        password: values.password || undefined,
        newPassword: values.newPassword || undefined,
      };

      const data = await settings(payload);

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (data?.success) {
        await update(); // ✅ 有些情況 update 是 async，await 更保險
        setSuccess(data.success);
        return;
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  // const form = useForm<z.infer<typeof SettingsSchema>>({
  //   resolver: zodResolver(SettingsSchema),
  //   defaultValues: {
  //     password: undefined,
  //     newPassword: undefined,
  //     name: user?.name || undefined,
  //     email: user?.email || undefined,
  //     role: user?.role || undefined,
  //     isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
  //   },
  // });

  // useEffect(() => {
  //   if (!user) return;

  //   form.reset({
  //     name: user.name ?? "",
  //     email: user.email ?? "",
  //     role: user.role ?? UserRole.USER,
  //     isTwoFactorEnabled: user.isTwoFactorEnabled ?? false,
  //   });
  // }, [user, form]);

  // const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
  //   startTransition(() => {
  //     settings(values)
  //       .then((data) => {
  //         if (data.error) {
  //           setError(data.error);
  //         }

  //         if (data.success) {
  //           update();
  //           setSuccess(data.success);
  //         }
  //       })
  //       .catch(() => setError("Something went wrong!"));
  //   });
  // };

  return (
    <Card className="sm:w-[600px] w-[400px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">⛭ Settings</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/*  */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Name</label>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    value={field.value ?? ""} // ✅ 永遠 controlled
                    placeholder="John Doe"
                    disabled={isPending}
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

          {user?.isOAuth === false && (
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
                        {...field}
                        value={field.value ?? ""} // ✅ 永遠 controlled
                        placeholder="john.doe@example.com"
                        type="email"
                        disabled={isPending}
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
                      <Input
                        {...field}
                        value={field.value ?? ""} // ✅ 永遠 controlled
                        placeholder="******"
                        type="password"
                        disabled={isPending}
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
              {/* NewPassword */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">NewPassword</label>
                <Controller
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        value={field.value ?? ""} // ✅ 永遠 controlled
                        placeholder="******"
                        type="password"
                        disabled={isPending}
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
            </>
          )}
          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Role</label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select
                  disabled={isPending}
                  value={field.value} // ✅ 用 value（controlled），不要 defaultValue
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.USER}>User</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {user?.isOAuth === false && (
            <>
              {/* 2FA only for non-OAuth */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <Controller
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel htmlFor="form-rhf-switch-twoFactor">
                          Two Factor Authentication{" "}
                        </FieldLabel>
                        <FieldDescription>
                          Enable two factor authentication for your account
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        disabled={isPending}
                        checked={!!field.value} // ✅ 永遠 boolean
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </div>
            </>
          )}

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit">
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SettingPage;
