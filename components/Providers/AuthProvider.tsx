import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../lib/store";
import { fetchUser } from "../../lib/apiCalls/profile";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error } = useQuery({
    queryKey: ["fetchUser"],
    queryFn: fetchUser,
    refetchOnMount: true,
    retryOnMount: true,
  });

  const { setUser } = useUserStore();

  useEffect(() => {
    if (data) {
      setUser(data.user);
    } else if (error) {
      console.log(error.message);
    }
  }, [data]);

  return <>{children}</>;
};

export default AuthProvider;
