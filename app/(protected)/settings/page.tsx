import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const SettingPage = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          await signOut();
          redirect("http://localhost:3000/auth/login");
        }}
      >
        <Button type="submit">SignOut</Button>
      </form>
    </div>
  );
};

export default SettingPage;
