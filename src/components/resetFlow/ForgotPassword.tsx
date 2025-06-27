import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import clsx from "clsx";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "../../schemas/resetSchema";
import { sendForgotPassword } from "../../services/api/resetApi";

interface ForgotPasswordProps {
  onSuccess: (email: string) => void;
}

const ForgotPassword = ({ onSuccess }: ForgotPasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ForgotPasswordSchema) => sendForgotPassword(data.email),
    onSuccess: (_, variables) => {
      toast.success("OTP sent if email exists.");
      onSuccess(variables.email);
    },
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit = (data: ForgotPasswordSchema) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-500 dark:text-cyan-400">Forgot Password</h2>

      <div>
        <label className="dark:text-cyan-300">Email</label>
        <input
          {...register("email")}
          className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 outline-none"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={clsx("w-full text-white py-2 rounded", isPending ? "bg-gray-400" : "bg-blue-600 dark:bg-cyan-600")}
      >
        {isPending ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
};

export default ForgotPassword;