'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/ui/logo';
import { signIn } from 'next-auth/react';
import { register } from '@/app/services/auth';

export function AuthForm({ type = "signin" }: { type?: "signin" | "signup" }) {
    const [formData, setFormData] = useState<{
        email: string;
        password: string;
        full_name?: string;
        confirmPassword?: string;
    }>({
        email: '',
        password: '',
        ...(type === 'signup' && {
            full_name: '',
            confirmPassword: ''
        })
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (type === 'signup') {
            if (!formData.full_name) newErrors.full_name = "Full name is required";
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords don't match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            if (type === 'signup') {
                console.log('Attempting registration with:', {
                    email: formData.email,
                    full_name: formData.full_name,
                    password: formData.password // Log actual password for debugging
                });

                const response = await register({
                    full_name: formData.full_name || '',
                    email: formData.email,
                    password: formData.password,
                    confirm_password: formData.confirmPassword || ''
                });
                
                if (response.message) {
                    console.log('Registration successful, attempting auto-login');
                    // Automatically sign in after successful registration
                    const result = await signIn('credentials', {
                        email: formData.email,
                        password: formData.password,
                        redirect: false
                    });

                    if (result?.error) {
                        console.error('Auto-login error:', result.error);
                        setErrors({ general: 'Registration successful, but automatic login failed. Please try logging in manually.' });
                    } else if (result?.ok) {
                        window.location.href = '/';
                    }
                }
            } else {
                // Format the credentials
                const credentials = {
                    email: formData.email.trim(),
                    password: formData.password
                };

                console.log('Submitting login form with:', {
                    email: credentials.email,
                    password: credentials.password // Log actual password for debugging
                });

                const result = await signIn('credentials', {
                    ...credentials,
                    redirect: false
                });

                console.log('Sign in result:', result);

                if (result?.error) {
                    console.error('Sign in error:', result.error);
                    let errorMessage = result.error;
                    if (errorMessage === 'CredentialsSignin') {
                        errorMessage = 'Invalid email or password';
                    } else if (errorMessage.includes('No user with this email')) {
                        errorMessage = 'No account found with this email address';
                    }
                    setErrors({ general: errorMessage });
                } else if (result?.ok) {
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
            
            if (error instanceof Error) {
                try {
                    // Try to parse the error message as JSON for validation errors
                    const validationErrors = JSON.parse(error.message);
                    if (typeof validationErrors === 'object') {
                        // Set field-specific errors
                        Object.entries(validationErrors).forEach(([field, messages]) => {
                            if (Array.isArray(messages) && messages.length > 0) {
                                setErrors(prev => ({
                                    ...prev,
                                    [field]: messages[0] // Take the first error message for each field
                                }));
                            }
                        });
                        return;
                    }
                } catch {
                    // If parsing fails, handle as a regular error message
                    const errorMessage = error.message.toLowerCase();
                    
                    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
                        setErrors({ general: 'Network error. Please check your connection.' });
                    } else if (errorMessage.includes('email already exists')) {
                        setErrors({ email: 'This email is already registered' });
                    } else if (errorMessage.includes('invalid credentials')) {
                        setErrors({ general: 'Invalid email or password' });
                    } else if (errorMessage.includes('password')) {
                        setErrors({ password: 'Password must be at least 6 characters' });
                    } else if (errorMessage.includes('confirm')) {
                        setErrors({ confirmPassword: 'Passwords do not match' });
                    } else {
                        setErrors({ general: error.message });
                    }
                }
            } else {
                setErrors({ general: 'An unexpected error occurred' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mx-auto px-2"
        >
            <div className="text-center">
                <div className="relative z-20 flex items-center justify-center text-lg font-medium mb-5 sm:hidden">
                    <Logo size='dxl' />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-5">
                    {type === 'signin' ? 'Welcome back' : 'Create an account'}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground my-8">
                    {type === 'signin'
                        ? 'Enter your credentials to access your dashboard'
                        : 'Start your learning journey with us'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 border rounded-lg p-4 sm:p-4 lg:p-6">
                {type === 'signup' && (
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                            <Input
                                id="full_name"
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={errors.full_name ? 'border-destructive' : ''}
                            />
                            <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        {errors.full_name && (
                            <p className="text-sm text-destructive">{errors.full_name}</p>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={errors.password ? 'border-destructive' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                </div>

                {type === 'signup' && (
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={errors.confirmPassword ? 'border-destructive' : ''}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>
                )}

                {type === 'signin' && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                            />
                            <Label htmlFor="rememberMe">Remember me</Label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                )}

                {errors.general && (
                    <p className="text-sm text-destructive text-center">{errors.general}</p>
                )}

                <Button variant={'brand'} type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait...
                        </>
                    ) : (
                        type === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase my-8">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled={isLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="#4285F4"
                        />
                    </svg>
                    Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                            fill="#24292F"
                        />
                    </svg>
                    GitHub
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
                {type === 'signin' ? (
                    <>
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/auth/signup"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <Link
                            href="/auth/signin"
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </>
                )}
            </p>
        </motion.div>
    );
}