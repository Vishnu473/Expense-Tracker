import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/registerSchema";
import type { RegisterSchema } from "../schemas/registerSchema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { fetchAndSetBankAccounts } from "../utils/fetchAndSetBankAccounts";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: async(res) => {
            dispatch(setCredentials(res.data));
             await fetchAndSetBankAccounts(dispatch);
            toast.success("Registration successful");
            navigate("/dashboard");
        },
        onError: () => toast.error("Registration failed. Try again."),
    });

    const onSubmit = (data: RegisterSchema) => mutate(data);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-blue-500 dark:text-cyan-400">Register</h2>

                <div>
                    <label className="dark:text-cyan-300">Name</label>
                    <input {...register("name")} className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="dark:text-cyan-300">Email</label>
                    <input {...register("email")} className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="dark:text-cyan-300">Password</label>
                    <input type="password" {...register("password")} className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300" />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="dark:text-cyan-300">Phone</label>
                    <input type="tel" {...register("phone")} className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300" />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <button
                    type="submit"
                    className={clsx("w-full text-white py-2 rounded", isPending ? "disabled:bg-gray-500" : "bg-blue-600 dark:bg-cyan-600")}
                    disabled={isPending}
                >
                    {isPending ? "Registering..." : "Register"}
                </button>
                <div className="text-center text-md dark:text-gray-400">
                    Already have an account?{" "} <span className="underline text-blue-600 dark:text-cyan-400"><Link to="/login">LogIn</Link></span> here
                </div>
            </form>
        </div>
    );
};

export default Register;
