import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { resetPasswordSchema, type ResetPasswordSchema } from "../../schemas/resetSchema";
import { resetPassword } from "../../services/api/resetApi";

interface ResetPasswordProps {
  email: string;
}

const ResetPassword = ({ email }: ResetPasswordProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ResetPasswordSchema) =>
      resetPassword(email, data.password),
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate("/login");
    },
    onError: () => toast.error("Failed to reset password"),
  });

  const onSubmit = (data: ResetPasswordSchema) => mutate(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-blue-500 dark:text-cyan-400">
        Reset Password
      </h2>

      <div>
        <label className="dark:text-cyan-300">New Password</label>
        <input
          {...register("password")}
          type="password"
          className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="dark:text-cyan-300">Confirm Password</label>
        <input
          {...register("confirmPassword")}
          type="password"
          className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={clsx(
          "w-full text-white py-2 rounded",
          isPending ? "disabled:bg-gray-500" : "bg-blue-600 dark:bg-cyan-600"
        )}
        disabled={isPending}
      >
        {isPending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;