'use client'
import FormSuccess from "@/components/shared/FormSuccess";
import RoleGate from "@/components/shared/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { admin } from "@/lib/actions/admin.actions";
import { UserRole } from "@prisma/client";
import React from "react";
import { toast } from "sonner";

const page = () => {

  const onAPiRouteClick = async () => {
     const response =  await fetch("/api/admin",)

     if (response.ok) {
        toast.success("Allowed API Route!") 
    }else {
      toast.error("Forbidden API Route!")
     }
  }


  const onServerActionClick = async () => {
    const isAdmin = await admin();

      if (isAdmin.error) {
        toast.error("Forbidden Server Action!")

      }else if (isAdmin.success) {
        toast.success("Allowed Server Action!")
      }
  }

  return <Card className = "w-[600px]" >  
                <CardHeader>
                <p className="text-2xl text-semibold text-center">
                Admin
            </p>
                </CardHeader>

            <CardContent className = "space-y-4" >
            <RoleGate allowedRole={UserRole.ADMIN} >
              <FormSuccess message="You are allowed to see this content!"  />
            </RoleGate>

          <div className="flex flex-row items-center justify-between rounded-lg border shadow-md  p-3">

          <p className="text-sm font-medium" >Admin-only API Route </p>
              <Button onClick = {onAPiRouteClick}  >Click to test</Button>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border shadow-md  p-3">

          <p className="text-sm font-medium" >Admin-only Server Action </p>
              <Button   onClick={onServerActionClick} >Click to test</Button>
          </div>
            </CardContent>

  </Card>;
};

export default page;
