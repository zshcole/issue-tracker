'use server'

import * as z from 'zod'
import { redirect } from 'next/navigation'
import { getUserByEmail } from '@/lib/dal'

// Define zod schema validation
const SignInSchema = z.object({
    // the regex used by browsers to validate input[type=email] fields
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
    email: z.email({ pattern: z.regexes.html5Email }).min(1, 'Email is required.'),
    password: z.string().min(1, 'Password is required.')
})

const SignUpSchema = z.object({
    email: z.email({ pattern: z.regexes.html5Email }).min(1, 'Invalid email format.'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
})

export type ActionResponse = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    error?: string;
}

/**
 * Handles user sign-in by validating credentials, checking user email, verifying password,
 * and creating a session. Returns a structured response indicating success or failure.
 *
 * @param {FormData} formData - The form data containing 'email' and 'password' fields.
 * @returns {Promise<ActionResponse>} - The result of the sign-in attempt, including success status, message, and errors if any.
 */
export async function signIn(formData: FormData): Promise<ActionResponse> {
    try {
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string
            }

            // Validate with Zod
            const validateResult = SignInSchema.safeParse(data);
            if (!validateResult.success) {
                return {
                    success: false,
                    message: 'Validation failed.',
                    errors: validateResult.error.flatten().fieldErrors
                }
            }

            const user = await getUserByEmail(data.email)
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid email or password',
                    errors: {
                        email: ['Invalid email or password']
                    }
                }
            }

            const validPassword = await verifyPassword(data.password, user.password)
            if (!validPassword) {
                return {
                    success: false,
                    message: 'Invalid email or password',
                    errors: {
                        password: ['Invalid email or password']
                    }
                }
            }

            // Create session
            await createSession(user.id)

            return {
                success: true,
                message: 'Signed in successfully'
        }
    } catch (error) {
        console.error(error) // add error service in the future.
        return {
            success: false,
            message: 'An error occured while signing in',
            error: 'Failed to sign in'
        }
    }
}

/**
 * Handles user registration by validating input, checking for existing users, creating a new user,
 * and starting a session. Returns a structured response indicating success or failure.
 *
 * @param {FormData} formData - The form data containing 'email', 'password', and 'confirmPassword' fields.
 * @returns {Promise<ActionResponse>} - The result of the sign-up attempt, including success status, message, and errors if any.
 */
export async function signUp(formData: FormData): Promise<ActionResponse> {
    try {
            const data = {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                confirmPassword: formData.get('confirmPassword') as string,
            }

            // Validate with Zod
            const validationResult = SignUpSchema.safeParse(data)
            if (!validationResult.success) {
                return {
                    success: false,
                    message: 'Validation failed',
                    errors: validationResult.error.flatten().fieldErrors,
                }
            }

            const existingUser = await getUserByEmail(data.email)
            if (existingUser) {
            return {
                success: false,
                message: 'User with this email already exists',
                errors: {
                email: ['User with this email already exists'],
                },
            }
            }

            // Create new user
            const user = await createUser(data.email, data.password)
            if (!user) {
            return {
                success: false,
                message: 'Failed to create user',
                error: 'Failed to create user',
            }
            }

            // Create session for the newly registered user
            await createSession(user.id)

            return {
            success: true,
            message: 'Account created successfully',
            }

    } catch (error) {
        console.error('Sign up error: ', error) // add error service in the future.
        return {
            success: false,
            message: 'An error occured while signing in',
            error: 'Failed to sign in'
        }
    }
}

/**
 * Signs out the current user by deleting their session and redirecting to the sign-in page.
 * Throws an error if session deletion fails.
 *
 * @returns {Promise<void>} - Resolves when sign-out and redirect are complete.
 */
export async function signOut(): Promise<void> {
    try {
        await deleteSession()
    } catch (error) {
        console.error('Sign out error:', error)
        throw new Error('Failed to sign out')
    } finally {
        redirect('/signin')
    }
}