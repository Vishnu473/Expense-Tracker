import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VerifyOtp from "../components/resetFlow/VerifyOtp";
import ResetPassword from "../components/resetFlow/ResetPassword";
import ForgotPassword from "../components/resetFlow/ForgotPassword";

const ResetUserFlow = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ForgotPassword onSuccess={(e) => { setEmail(e); setStep("otp"); }} />
          </motion.div>
        )}
        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VerifyOtp email={email} onSuccess={() => setStep("reset")} />
          </motion.div>
        )}
        {step === "reset" && (
          <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResetPassword email={email} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetUserFlow;