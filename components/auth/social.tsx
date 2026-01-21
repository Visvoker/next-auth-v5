"use client";

import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

import { Button } from "../ui/button";

export const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="flex-1" variant="outline" onClick={() => {}}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button size="lg" className="flex-1" variant="outline" onClick={() => {}}>
        <FaDiscord className="h-5 w-5" />
      </Button>
    </div>
  );
};
