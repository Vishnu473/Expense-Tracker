import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { verifyOtpSchema, type VerifyOtpSchema } from "../../schemas/resetSchema";
import { resendOtp, verifyOtp } from "../../services/api/resetApi";

interface VerifyOtpProps {
  email: string;
  onSuccess: () => void;
}

const VerifyOtp = ({ email, onSuccess }: VerifyOtpProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifyOtpSchema) => verifyOtp(email, data?.otp),
    onSuccess: () => {
      toast.success("OTP verified!");
      onSuccess();
    },
    onError: () => toast.error("Invalid OTP"),
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtp(email),
    onSuccess: () => toast.success("OTP resent"),
    onError: () => toast.error("Failed to resend OTP"),
  });

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);


  const onSubmit = (data: VerifyOtpSchema) =>{
    mutate(data);
  } 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-500 dark:text-cyan-400">Verify OTP</h2>

      <div>
        <label className="dark:text-cyan-300">Enter OTP</label>
        <input
          {...register("otp")}
          maxLength={6}
          required
          pattern="\d{6}"
          className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300"
        />
        {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
      </div>

      <button type="submit" className={clsx("w-full text-white py-2 rounded", isPending ? "disabled:bg-gray-500" : "bg-blue-600 dark:bg-cyan-600")} disabled={isPending}>
        {isPending ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center text-sm dark:text-gray-300">
        Didn't receive?{" "}
        {timer > 0 ? (
          <span className="text-gray-400">Resend in {timer}s</span>
        ) : (
          <button type="button" onClick={() => { resendMutation.mutate(); setTimer(60); }} className="text-blue-600 dark:text-cyan-400 underline">
            Resend OTP
          </button>
        )}
      </div>
    </form>
  );
};

export default VerifyOtp;