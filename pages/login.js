import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShoppingBag, Truck, ShieldCheck, X, Smartphone } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const slides = [
    {
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1287",
        text: "Style is a way to say who you are without having to speak.",
        author: "Ralph Lauren",
        role: "Men's Fashion"
    },
    {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1287",
        text: "Fashion fades, only style remains the same.",
        author: "Coco Chanel",
        role: "Women's Collection"
    },
    {
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1287",
        text: "Playful comfort for the little ones who dream big.",
        author: "SmartBuy Kids",
        role: "Kids' Wear"
    }
];

export default function Login() {
    const router = useRouter();
    const { login, signup, loginWithGoogle, logout, user } = useAuth();

    // View State
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'admin', 'seller'
    const [method, setMethod] = useState('email');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    // State to track if the user JUST logged in, to enable auto-redirect
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    // Slideshow Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleRedirect = useCallback((role) => {
        const { redirect } = router.query;
        if (redirect) {
            router.push(redirect);
            return;
        }

        if (role === 'admin' || role === 'ADMIN') {
            router.push('/admin');
        } else if (role === 'seller' || role === 'SELLER') {
            router.push('/seller');
        } else {
            router.push('/');
        }
    }, [router]);

    // Redirect ONLY if user exists AND they just logged in
    useEffect(() => {
        if (user && justLoggedIn) {
            handleRedirect(user.role);
        }
    }, [user, justLoggedIn, handleRedirect]);

    const handleGoogleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await loginWithGoogle(selectedRole);
            toast.success(`Welcome back, ${user.displayName || 'User'}!`);
            setJustLoggedIn(true);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (view === 'signup') {
                await signup(email, password, name, selectedRole);
                toast.success('Account created successfully!');
                setJustLoggedIn(true);
            } else if (view === 'login') {
                await login(email, password);
                toast.success('Logged in successfully!');
                setJustLoggedIn(true);
            } else if (view === 'forgot') {
                toast.info('Password reset feature coming soon!'); // Implement sendPasswordResetEmail if needed
            }
        } catch (error) {
            console.error(error);
            // Transform Firebase errors
            if (error.code === 'auth/wrong-password') toast.error('Invalid password.');
            else if (error.code === 'auth/user-not-found') toast.error('No user found with this email.');
            else if (error.code === 'auth/email-already-in-use') toast.error('Email already in use.');
            else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
                const projectId = "smartbuy-c1da0"; // Hardcoded from config
                toast.error(`Configuration Error: Enable "Email/Password" in Firebase Console for project: ${projectId}.`, {
                    autoClose: 10000,
                    className: "font-bold"
                });
                console.error("FIREBASE CONFIG ERROR: Go to https://console.firebase.google.com/project/" + projectId + "/authentication/providers and enable Email/Password");
            }
            else toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMobileSubmit = async (e) => {
        e.preventDefault();

        if (!showOtp) {
            // Step 1: Request OTP
            if (mobile.length !== 10) {
                toast.error("Please enter a valid 10-digit mobile number.");
                return;
            }

            // Admin Demo
            if (selectedRole === 'admin' && mobile === '9999999999') {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    setShowOtp(true);
                    toast.info("OTP sent! (Use 1234 for demo)");
                }, 1000);
                return;
            }

            // Seller Demo (if accessed via this page)
            if (selectedRole === 'seller' && mobile === '8888888888') {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    setShowOtp(true);
                    toast.info("OTP sent! (Use 1234 for demo)");
                }, 1000);
                return;
            }

            toast.error("User not found (Demo Only: 9999999999 for Admin)");
        } else {
            // Step 2: Verify OTP
            if (otp !== '1234') {
                toast.error("Invalid OTP code.");
                return;
            }

            setIsLoading(true);
            try {
                let targetEmail = '';
                let targetPass = '';
                let targetRole = '';
                let redirectUrl = '';

                if (router.query.redirect) {
                    redirectUrl = router.query.redirect;
                }

                if (selectedRole === 'admin') {
                    targetEmail = 'admin@smartbuy.com';
                    targetPass = 'admin123';
                    targetRole = 'ADMIN';
                    if (!redirectUrl) redirectUrl = '/admin';
                } else if (selectedRole === 'seller') {
                    targetEmail = 'seller@smartbuy.com';
                    targetPass = 'seller123';
                    targetRole = 'SELLER';
                    if (!redirectUrl) redirectUrl = '/seller';
                } else {
                    throw new Error("Mobile login only supported for Admin/Seller demo.");
                }

                // Attempt Login
                let result;
                try {
                    result = await login(targetEmail, targetPass);
                } catch (loginErr) {
                    // Auto-create if missing
                    if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
                        console.log("Creating demo user...");
                        result = await signup(targetEmail, targetPass, 'Demo User', targetRole);
                    } else {
                        throw loginErr;
                    }
                }

                // Force Sync Role
                await fetch('/api/auth/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: result.user ? result.user.uid : result.uid,
                        email: targetEmail,
                        role: targetRole
                    })
                });

                toast.success("Login successful!");
                window.location.href = redirectUrl; // Force reload redirect

            } catch (error) {
                console.error("Mobile Login Fail:", error);
                toast.error("Login failed: " + error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const formVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            <Head>
                <title>{view === 'login' ? 'Sign In' : 'Join'} - SmartBuy</title>
            </Head>

            {/* Left Side - Image & Content */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:relative lg:block w-full lg:w-1/2 bg-white overflow-hidden p-3"
            >
                <div className="absolute inset-3 z-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-black/60 mix-blend-multiply z-10" />
                    <AnimatePresence>
                        <motion.img
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="h-full w-full object-cover absolute inset-0"
                            src={slides[currentSlide].image}
                            alt="Fashion vibe"
                        />
                    </AnimatePresence>
                </div>

                <div className="relative z-20 flex h-full flex-col justify-between p-12 text-white">
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="font-bold text-2xl tracking-tight">SmartBuy</span>
                        </div>
                    </Link>

                    <div className="max-w-md">
                        <h3 className="text-3xl font-medium leading-tight mb-4">&quot;{slides[currentSlide].text}&quot;</h3>
                        <p className="font-bold text-lg">{slides[currentSlide].author}</p>
                        <p className="text-white/70">{slides[currentSlide].role}</p>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-16 xl:px-20 bg-white relative z-10"
            >
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-6 text-center">
                        <h2 className="text-3xl font-black text-gray-900 uppercase">
                            {view === 'login' ? 'Welcome' : view === 'signup' ? 'Create Account' : 'Reset Password'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-wider">
                            {view === 'login' ? (
                                <>New here? <button onClick={() => setView('signup')} className="text-black hover:text-gray-700 underline">Join Now</button></>
                            ) : (
                                <>Have an account? <button onClick={() => setView('login')} className="text-black hover:text-gray-700 underline">Log in</button></>
                            )}
                        </p>
                    </div>

                    {/* Role Selector */}
                    <div className="mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Login As</p>
                        <div className="grid grid-cols-3 gap-2">
                            {['customer', 'admin', 'seller'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all ${selectedRole === role
                                        ? 'border-black bg-gray-100 shadow-sm text-black'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <span className="text-xs font-bold capitalize">{role}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Method Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                        <button
                            onClick={() => setMethod('email')}
                            className={`py-2 rounded-lg text-xs font-bold transition-all ${method === 'email' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Email
                        </button>
                        <button
                            onClick={() => setMethod('mobile')}
                            className={`py-2 rounded-lg text-xs font-bold transition-all ${method === 'mobile' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Phone Number
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleGoogleSubmit}
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-200"
                        >
                            <FcGoogle className="h-4 w-4" />
                            <span>Continue with Google</span>
                        </button>

                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-400 font-medium">Or continue with email</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={view}
                                variants={formVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                onSubmit={method === 'mobile' ? handleMobileSubmit : handleSubmit}
                                className="space-y-4"
                            >
                                {method === 'mobile' ? (
                                    <>
                                        <div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Smartphone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}
                                                    maxLength={10}
                                                    required
                                                    className="block w-full rounded-xl border-gray-300 pl-10 py-2.5 shadow-sm focus:border-black focus:ring-black sm:text-sm bg-gray-50/50"
                                                    placeholder="10-digit Mobile Number"
                                                />
                                            </div>
                                        </div>

                                        {showOtp && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        maxLength={4}
                                                        required
                                                        className="block w-full rounded-xl border-gray-300 pl-10 py-2.5 shadow-sm focus:border-black focus:ring-black sm:text-sm bg-gray-50/50 font-bold tracking-widest text-center"
                                                        placeholder="OTP Code"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2 text-center">Demo OTP: 1234</p>
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {view === 'signup' && (
                                            <div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        className="block w-full rounded-xl border-gray-300 pl-10 py-2.5 shadow-sm focus:border-black focus:ring-black sm:text-sm bg-gray-50/50"
                                                        placeholder="Full Name"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className="block w-full rounded-xl border-gray-300 pl-10 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50"
                                                    placeholder="Email Address"
                                                />
                                            </div>
                                        </div>

                                        {view !== 'forgot' && (
                                            <div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="block w-full rounded-xl border-gray-300 pl-10 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50"
                                                        placeholder="Password"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {view === 'login' && (
                                            <div className="flex items-center justify-end">
                                                <button type="button" onClick={() => setView('forgot')} className="text-sm font-medium text-black hover:text-gray-700">
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center rounded-xl bg-black py-2.5 px-3 text-sm font-semibold text-white shadow-lg shadow-gray-500/30 hover:shadow-gray-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all duration-200"
                                >
                                    {isLoading ? 'Processing...' : (
                                        <div className="flex items-center gap-2">
                                            {method === 'mobile' ? (
                                                <>{showOtp ? 'Verify & Login' : 'Get OTP'}</>
                                            ) : (
                                                <>
                                                    {view === 'login' && 'Sign In'}
                                                    {view === 'signup' && 'Sign Up'}
                                                    {view === 'forgot' && 'Reset'}
                                                </>
                                            )}
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </button>
                            </motion.form>
                        </AnimatePresence>

                        {/* Trust Badges */}
                        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                            <div className="flex flex-col items-center">
                                <ShieldCheck className="h-6 w-6 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Truck className="h-6 w-6 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <ShoppingBag className="h-6 w-6 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500">Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
