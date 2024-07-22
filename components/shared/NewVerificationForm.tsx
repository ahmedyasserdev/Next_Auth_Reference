"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/lib/actions/verficationToken.actions";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";
const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const onSubmit = useCallback(() => {
    if (success && error) return
    if (!token) {
      setError("Missing Token");
      return;
    }
    newVerification(token)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
      .catch(() => setError("Something went wrong"));
  }, [token , success , error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirming you verification."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center justify-center  ">
        {!success && !error && (
            <BeatLoader />

        )}
        <FormSuccess message={success} />
        {
            !success && (

                <FormError message={error} />
            )
        }
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
