import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import type { LoginSchema } from "../schemas/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { fetchAndSetBankAccounts } from "../utils/fetchAndSetBankAccounts";
import { getAllCategories } from "../services/api/categoryApi";
import { setCategories } from "../redux/slices/categorySlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
        retry: (failureCount, error:any) => {
            return error?.response == null && failureCount < 1;
        },
        retryDelay: attempt => 1000 * 2 ** attempt,
        onSuccess: async (res) => {
            dispatch(setCredentials(res.data));
            await Promise.all([
                fetchAndSetBankAccounts(dispatch),
                getAllCategories().then(data => dispatch(setCategories(data)))
            ]);
            toast.success("Logged in!");
            sessionStorage.removeItem("redirectedOnce");
            navigate("/dashboard");
        },
        onError: () => toast.error("Invalid credentials"),
    });

    const onSubmit = (data: LoginSchema) => mutate(data);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-blue-500 dark:text-cyan-400">Login</h2>
                <div>
                    <label htmlFor="email" className="dark:text-cyan-300">Email</label>
                    <input id="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email")} className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300" />
                    {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="dark:text-cyan-300">Password</label>
                    <input id="password" aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined}
                        {...register("password")} type="password" className="w-full p-2 rounded text-black dark:text-white dark:bg-gray-600 outline-none border border-gray-300 dark:border-gray-500 hover:border-blue-500 dark:hover:border-cyan-300" />
                    {errors.password && <p id="password-error" className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div className="text-right text-md dark:text-gray-400">
                    {" "}<span className="underline text-blue-600 dark:text-cyan-400"><Link to="/reset-user">Forgot Password?</Link></span>
                </div>
                <button type="submit" aria-busy={isPending} className={clsx("w-full text-white py-2 rounded", isPending ? "disabled:bg-gray-500 disabled:cursor-not-allowed" : "bg-blue-600 dark:bg-cyan-600")} disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </button>
                <div aria-label="Don't have an account?" className="text-center text-md dark:text-gray-400">
                    Don't have an account?{" "}<span aria-describedby="Register here" className="underline text-blue-600 dark:text-cyan-400"><Link to="/register">SignUp</Link></span> here
                </div>
            </form>
        </div>
    );
};

export default Login;