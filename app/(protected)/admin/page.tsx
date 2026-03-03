"use client";

import { admin } from "@/actions/admin";
import { UserRole } from "@/app/generated/prisma/enums";

import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { toast } from "sonner";

const AdminPage = () => {
  const onApiRouteClick = async () => {
    try {
      const data = await admin();

      if (data?.error) {
        toast.error(data.error);
      }

      if (data?.success) {
        toast.success(data.success);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const onServerActionClick = async () => {
    try {
      const response = await fetch("/api/admin");

      if (!response.ok) {
        toast.error("Forbidden API Route!");
        return;
      }

      toast.success("Allowed API Route!");
    } catch (error) {
      toast.error("Network error occurred!");
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
