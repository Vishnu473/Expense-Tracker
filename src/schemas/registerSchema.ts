import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name is required" }),

    email: z
        .string()
        .email({ message: "Invalid email" }),

    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number must not exceed 15 digits" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;