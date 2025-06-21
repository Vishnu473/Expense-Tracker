import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default PrivateRoute;
