"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { newVerification } from "@/actions/new-verification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      if (!token) {
        setError("Missing token!");
        setIsLoading(false);
        return;
      }

      try {
        const data = await newVerification(token);
        setSuccess(data.success);
        setError(data.error);
      } catch (error) {
        setError("Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [token]);

  return (
    <CardWrapper
      headerLabel="Confirm your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full justify-center">
        {isLoading ? (
          <BeatLoader />
        ) : success ? (
          <p className="text-sm text-emerald-600">{success}</p>
        ) : (
          <p className="text-sm text-destructive">
            {error ?? "Verification failed"}
          </p>
        )}
      </div>
    </CardWrapper>
  );
};
