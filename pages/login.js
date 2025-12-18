import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Smartphone, Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from "next-auth/react";

export default function Login() {
    const router = useRouter();
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'mobile', 'google'
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Mobile Login States
    const [mobileStep, setMobileStep] = useState('phone'); // 'phone', 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpHash, setOtpHash] = useState('');

    // Google Login States
    const [googleEmail, setGoogleEmail] = useState('');

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1287",
            text: "Style is a way to say who you are without having to speak.",
            author: "Ralph Lauren",
            role: "Fashion Legend"
        },
        {
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1287",
            text: "Fashion fades, only style remains the same.",
            author: "Coco Chanel",
            role: "Icon"
        },
        {
            image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1287",
            text: "Shoes transform your body language and attitude. They lift you physically and emotionally.",
            author: "Christian Louboutin",
            role: "Designer"
        },
        {
            image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=1287",
            text: "Tradition is not the worship of ashes, but the preservation of fire.",
            author: "Gustav Mahler",
            role: "Classic"
        },
        {
            image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=1287",
            text: "Style has no age limit. Let them dream in colors.",
            author: "Iris Apfel",
            role: "Fashion Icon"
        }
    ];

    useEffect(() => {
        // Preload images for seamless transitions
        slides.forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
        });

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);



    const handleGoogleSubmit = (e) => {
        e.preventDefault();
        if (googleEmail && googleEmail.includes('@gmail.com')) {
            setIsLoading(true);
            // Simulate Google Login
            setTimeout(() => {
                setIsLoading(false);
                alert(`Google Login Successful for ${googleEmail}! (Demo)`);
            }, 2000);
        } else {
            alert("Please enter a valid Gmail address.");
        }
    };

    const handleMobileSubmit = async (e) => {
        e.preventDefault();
        if (mobileStep === 'phone') {
            setIsLoading(true);
            try {
                const res = await fetch('/api/auth/otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: phoneNumber })
                });
                const data = await res.json();
                if (data.success) {
                    setOtpHash(data.hash);
                    setMobileStep('otp');
                    // Alert for dev mode since user cant see server logs easily
                    console.log(`Hash: ${data.hash}`);
                } else {
                    alert('Failed to send OTP');
                }
            } catch (err) {
                alert('An error occurred sending OTP');
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(true);
            const otpValue = otp.join("");

            const res = await signIn('credentials', {
                redirect: false,
                phone: phoneNumber,
                otp: otpValue,
                hash: otpHash
            });

            setIsLoading(false);

            if (res?.error) {
                alert(res.error);
            } else {
                // Success
                router.push('/');
            }
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Handle success based on view
            if (view === 'login') alert('Logged in successfully (Demo)');
            if (view === 'signup') alert('Account created successfully (Demo)');
            if (view === 'forgot') alert('Password reset link sent (Demo)');
        }, 1500);
    };

    const formVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (

        <div className="min-h-screen bg-white flex overflow-hidden">
            <Head>
                <title>
                    {view === 'login' ? 'Sign In' : view === 'signup' ? 'Join SmartBuy' : 'Reset Password'} - SmartBuy
                </title>
            </Head>

            {/* Left Side - Image & Content */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:relative lg:block w-full lg:w-1/2 bg-gray-900 overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/60 mix-blend-multiply z-10" />

                    {/* Main Image */}
                    <AnimatePresence mode="wait">
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
                </motion.div>

                <div className="relative z-20 flex h-full flex-col justify-between p-12 text-white">
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30"
                            >
                                <span className="text-white font-bold text-xl">S</span>
                            </motion.div>
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="font-bold text-2xl tracking-tight"
                            >
                                SmartBuy
                            </motion.span>
                        </div>
                    </Link>

                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.8 }}
                        className="max-w-md"
                    >
                        <div className="mb-6 flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        <div className="h-32 mb-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <h3 className="text-3xl font-medium leading-tight mb-4">
                                        "{slides[currentSlide].text}"
                                    </h3>
                                    <div>
                                        <p className="font-bold text-lg">{slides[currentSlide].author}</p>
                                        <p className="text-white/70">{slides[currentSlide].role}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dots indicator */}
                        <div className="flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex justify-between items-end text-sm text-white/60"
                    >
                        <p>© 2025 SmartBuy Inc.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Custom bezier for premium feel
                className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative z-10"
            >

                {/* Close Button */}
                <button
                    onClick={() => view === 'login' ? router.push('/') : setView('login')}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Mobile-only Logo */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {view === 'login' && 'Welcome'}
                            {view === 'signup' && 'Create an account'}
                            {view === 'forgot' && 'Reset password'}
                            {view === 'mobile' && 'Mobile Login'}
                            {view === 'google' && 'Google Login'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {view === 'login' && (
                                <>New to SmartBuy? <button onClick={() => setView('signup')} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Start for free</button></>
                            )}
                            {view === 'signup' && (
                                <>Already have an account? <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Log in</button></>
                            )}
                            {view === 'forgot' && (
                                <>Remember your password? <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Back to login</button></>
                            )}
                            {view === 'mobile' && (
                                <>Prefer email? <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Login with Email</button></>
                            )}
                            {view === 'google' && (
                                <>Prefer email? <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Login with Email</button></>
                            )}
                        </p>
                    </motion.div>

                    {view !== 'forgot' && view !== 'mobile' && view !== 'google' && (
                        <div className="mt-6">
                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setIsLoading(true);
                                        signIn('google');
                                    }}
                                    disabled={isLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                >
                                    <FcGoogle className="h-5 w-5" />
                                    <span className="text-gray-600">Google</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setView('mobile')}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                >
                                    <Smartphone className="h-5 w-5 text-gray-500" />
                                    <span className="text-gray-600">Mobile</span>
                                </motion.button>
                            </div>

                            <div className="relative mt-8">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-100" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-4 text-gray-400 font-medium">Or continue with email</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <AnimatePresence mode="wait">

                            {/* MOBILE LOGIN FORM */}
                            {view === 'mobile' ? (
                                <motion.form
                                    key="mobile"
                                    variants={formVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onSubmit={handleMobileSubmit}
                                    className="space-y-5"
                                >
                                    {mobileStep === 'phone' ? (
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Smartphone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    required
                                                    className="block w-full rounded-xl border-gray-300 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-white"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500">We will send you a one-time SMS to verify your number.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <button type="button" onClick={() => setMobileStep('phone')} className="text-gray-500 hover:text-gray-900">
                                                    <ArrowLeft className="w-4 h-4" />
                                                </button>
                                                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                                            </div>
                                            <div className="flex gap-2 justify-between">
                                                {otp.map((data, index) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        name="otp"
                                                        maxLength="1"
                                                        value={data}
                                                        onChange={e => handleOtpChange(e.target, index)}
                                                        className="w-12 h-12 text-center text-xl font-semibold rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                                        onFocus={e => e.target.select()}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {mobileStep === 'phone' ? 'Get OTP' : 'Verify & Login'}
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        )}
                                    </motion.button>
                                </motion.form>

                            ) : view === 'google' ? (

                                /* GOOGLE LOGIN FORM */
                                <motion.form
                                    key="google"
                                    variants={formVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onSubmit={handleGoogleSubmit}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label htmlFor="google-email" className="block text-sm font-medium text-gray-700 mb-1">Gmail Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="google-email"
                                                type="email"
                                                value={googleEmail}
                                                onChange={(e) => setGoogleEmail(e.target.value)}
                                                required
                                                className="block w-full rounded-xl border-gray-300 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-white"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>Continue with Google</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        )}
                                    </motion.button>
                                </motion.form>

                            ) : (

                                /* EMAIL/PASSWORD FORMS */
                                <motion.form
                                    key={view}
                                    variants={formVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {view === 'signup' && (
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    className="block w-full rounded-xl border-gray-300 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-white"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="block w-full rounded-xl border-gray-300 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-white"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    {view !== 'forgot' && (
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    required
                                                    className="block w-full rounded-xl border-gray-300 pl-10 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50/50 transition-colors hover:bg-white"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {view === 'login' && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember-me"
                                                    name="remember-me"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                                />
                                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                                    Remember me
                                                </label>
                                            </div>

                                            <div className="text-sm">
                                                <button type="button" onClick={() => setView('forgot')} className="font-medium text-blue-600 hover:text-blue-500">
                                                    Forgot password?
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {view === 'login' && 'Sign in to Account'}
                                                {view === 'signup' && 'Create Account'}
                                                {view === 'forgot' && 'Reset Password'}
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Trust Badges */}
                        <div className="mt-10 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
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
