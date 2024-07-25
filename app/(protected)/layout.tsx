import React from "react";
import Navbar from "./_components/Navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex flex-col h-full gap-y-10 items-center justify-center  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
