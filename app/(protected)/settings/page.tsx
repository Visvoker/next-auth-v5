"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingPage = () => {
  const user = useCurrentUser();
  const onClick = () => {
    logout();
  };

  return (
    <div>
      {/* {JSON.stringify(user)} */}
      <Button type="submit" onClick={onClick}>
        SignOut
      </Button>
    </div>
  );
};

export default SettingPage;
