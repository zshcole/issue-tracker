'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/db/utils/client'
import { getUserByEmail } from '@/lib/dal'

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
 * @param {FormData} data - The form data containing 'email' and 'password' fields.
 * @returns {Promise<ActionResponse>} - The result of the sign-in attempt, including success status, message, and errors if any.
 */
export async function signIn(formData: FormData): Promise<ActionResponse> {
    const supabase = await createClient()
    try {

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: formData.get('email') as string,
            password: formData.get('password') as string
        })

        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
                errors: {
                    email: ['Invalid email or password']
                }
            }
        }

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
    const supabase = await createClient()
    try {
            const {data: user, error } = await supabase.auth.signUp({
                email: formData.get('email') as string,
                password: formData.get('password') as string
            })

            if (error) {
                // Check for duplicate email error (Supabase returns a specific message/code)
                if (error.message && error.message.toLowerCase().includes('already registered')) {
                    return {
                        success: false,
                        message: 'User with this email already exists',
                        errors: {
                            email: ['User with this email already exists'],
                        },
                    }
                }
                // Handle other errors
                return {
                    success: false,
                    message: 'Failed to create user',
                    error: error.message,
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