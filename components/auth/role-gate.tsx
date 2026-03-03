"use client";

import { UserRole } from "@/app/generated/prisma/enums";
import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "../form-error";

type RoleGateType = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({ children, allowedRole }: RoleGateType) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
