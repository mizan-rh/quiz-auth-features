"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import { Header } from "./header";

export const CardWrapper = ({
  children,
  headerLabel,
  showSocial,
}) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      
    </Card>
  );
};
