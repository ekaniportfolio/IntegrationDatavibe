import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../language-provider';

// ─── Validation helpers ───
const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);

interface GlassAuthCardProps {
    onClose?: () => void;
    isVisible: boolean;
    isExpanded?: boolean;
    isClosing?: boolean;
    delay?: number;
    duration?: number;
    stagger?: number;
    closeDuration?: number;
    closeStagger?: number;
    onAnimationComplete?: () => void;
    onForgotPassword?: () => void;
    onSignUp?: () => void;
    onLoginSuccess?: () => void;
}

export const GlassAuthCard: React.FC<GlassAuthCardProps> = ({ 
    isVisible, 
    isExpanded = true,
    isClosing = false,
    delay = 0.2, 
    duration = 0.8,
    stagger = 0.1,
    closeDuration = 0.2,
    closeStagger = 0.05,
    onAnimationComplete,
    onForgotPassword,
    onSignUp,
    onLoginSuccess,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const { t } = useTranslation();

    const SIDE_IN_DURATION = duration;
    const STAGGER_DELAY = stagger;
    const CLOSE_DURATION = closeDuration;
    const EASE_ELASTIC = [0.25, 0.46, 0.45, 0.94];

    // Item variants (Coming from LEFT side - SPATIAL FLOW)
    const leftItemVariants = {
        hidden: { x: -1000, opacity: 0, filter: "blur(10px)" }, 
        visible: { 
            x: 0, 
            opacity: 1, 
            filter: "blur(0px)",
            transition: { 
                x: { duration: SIDE_IN_DURATION, ease: EASE_ELASTIC },
                opacity: { duration: 0.1, ease: "linear" },
                filter: { duration: SIDE_IN_DURATION }
            }
        },
        exit: { 
            x: -1000, 
            opacity: 0, 
            filter: "blur(10px)",
            transition: { 
                x: { duration: SIDE_IN_DURATION, ease: "backIn" },
                opacity: { duration: 0.1, delay: SIDE_IN_DURATION - 0.1 },
                filter: { duration: SIDE_IN_DURATION }
            }
        },
        closing: { 
            x: -1000, 
            opacity: 0, 
            filter: "blur(10px)",
            transition: { 
                x: { duration: CLOSE_DURATION, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.1, delay: Math.max(0, CLOSE_DURATION - 0.1) },
                filter: { duration: CLOSE_DURATION }
            }
        }
    };

    // Item variants (Coming from RIGHT side - SPATIAL FLOW)
    const rightItemVariants = {
        hidden: { x: 1000, opacity: 0, filter: "blur(10px)" },
        visible: { 
            x: 0, 
            opacity: 1, 
            filter: "blur(0px)",
            transition: { 
                x: { duration: SIDE_IN_DURATION, ease: EASE_ELASTIC },
                opacity: { duration: 0.1, ease: "linear" },
                filter: { duration: SIDE_IN_DURATION }
            }
        },
        exit: { 
            x: 1000, 
            opacity: 0, 
            filter: "blur(10px)",
            transition: { 
                x: { duration: SIDE_IN_DURATION, ease: "backIn" },
                opacity: { duration: 0.1, delay: SIDE_IN_DURATION - 0.1 },
                filter: { duration: SIDE_IN_DURATION }
            }
        },
        closing: { 
            x: 1000, 
            opacity: 0, 
            filter: "blur(10px)",
            transition: { 
                x: { duration: CLOSE_DURATION, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.1, delay: Math.max(0, CLOSE_DURATION - 0.1) },
                filter: { duration: CLOSE_DURATION }
            }
        }
    };

    if (!isExpanded) return null;

    const animationState = isClosing ? "closing" : (isVisible ? "visible" : "hidden");

    // ─── Validation ───
    const validateEmail = (value: string): string | undefined => {
        if (!value.trim()) return t('auth.emailRequired');
        if (!isValidEmail(value)) return t('auth.emailInvalid');
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (!value) return t('auth.passwordRequired');
        return undefined;
    };

    const handleBlurEmail = () => {
        setTouched(prev => ({ ...prev, email: true }));
        const error = validateEmail(email);
        setErrors(prev => ({ ...prev, email: error, general: undefined }));
    };

    const handleBlurPassword = () => {
        setTouched(prev => ({ ...prev, password: true }));
        const error = validatePassword(password);
        setErrors(prev => ({ ...prev, password: error, general: undefined }));
    };

    const handleSubmit = async () => {
        if (isSubmitting || loginSuccess) return;

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        setTouched({ email: true, password: true });
        setErrors({ email: emailError, password: passwordError });

        if (emailError || passwordError) return;

        setIsSubmitting(true);
        setErrors({});

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1800));

        // Simulated login success
        setIsSubmitting(false);
        setLoginSuccess(true);
        toast.success(t('auth.loginSuccess'), { description: t('auth.welcomeDatavibe') });

        // Close after brief success display
        setTimeout(() => {
            onLoginSuccess?.();
        }, 1200);
    };

    return (
        <motion.div 
            className="w-full h-full relative"
            initial="hidden"
            animate={animationState}
            exit="exit" 
            variants={{
                hidden: { opacity: 0 },
                visible: { 
                    opacity: 1,
                    transition: { 
                        duration: 0.01,
                        staggerChildren: STAGGER_DELAY,
                        delayChildren: delay
                    }
                },
                closing: {
                    opacity: 1,
                    transition: {
                        staggerChildren: closeStagger,
                        staggerDirection: -1,
                    }
                },
                exit: { 
                    opacity: 1,
                    transition: { 
                        staggerChildren: STAGGER_DELAY, 
                        staggerDirection: -1, 
                        when: "afterChildren"
                    }
                }
            }}
        >
            <div className="relative z-10 flex flex-col gap-5 p-8 overflow-visible h-full justify-center">
                
                {/* Header Section */}
                <motion.div variants={leftItemVariants} className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight font-manrope">
                        {t('auth.welcomeBack')}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        {t('auth.enterCredentials')}
                    </p>
                </motion.div>

                {/* Social Login Buttons */}
                <div className="flex flex-col gap-3">
                    <motion.button variants={leftItemVariants} onClick={() => window.open('https://accounts.google.com', '_blank', 'noopener,noreferrer')} className="flex items-center justify-center gap-3 w-full h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-[background-color,border-color] duration-300 group cursor-pointer">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-sm font-semibold text-foreground group-hover:text-foreground transition-colors">{t('auth.continueGoogle')}</span>
                    </motion.button>
                    <motion.button variants={rightItemVariants} onClick={() => window.open('https://accounts.spotify.com/login', '_blank', 'noopener,noreferrer')} className="flex items-center justify-center gap-3 w-full h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-[background-color,border-color] duration-300 group cursor-pointer">
                        <img src="https://www.svgrepo.com/show/475684/spotify-color.svg" alt="Spotify" className="w-5 h-5" />
                        <span className="text-sm font-semibold text-foreground group-hover:text-foreground transition-colors">{t('auth.continueSpotify')}</span>
                    </motion.button>
                </div>

                {/* Divider */}
                <motion.div variants={leftItemVariants} className="flex items-center justify-center relative w-full my-2">
                    <div className="flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative">
                        <div className="flex-none w-full">
                            <div className="h-px relative w-full">
                                <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[1px] inset-0 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center px-4 relative shrink-0">
                        <p className="font-bold text-[#a1a1aa] text-sm text-center font-manrope leading-5">{t('auth.orContinueWith')}</p>
                    </div>

                    <div className="flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative">
                        <div className="flex-none w-full">
                            <div className="h-px relative w-full">
                                <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[1px] inset-0 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    <motion.div variants={rightItemVariants} className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.email')}</label>
                        <div className="relative group">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.email && errors.email ? 'text-red-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); if (touched.email) { setErrors(prev => ({ ...prev, email: validateEmail(e.target.value), general: undefined })); } }}
                                onBlur={handleBlurEmail}
                                className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.email && errors.email ? 'border-red-400/60 focus:border-red-400' : 'border-border focus:border-datavibe-primary/50'}`}
                                placeholder="nom@entreprise.com"
                                disabled={isSubmitting || loginSuccess}
                            />
                        </div>
                        <AnimatePresence>
                            {touched.email && errors.email && (
                                <motion.p initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="text-red-400 text-xs ml-1 font-medium">{errors.email}</motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                     <motion.div variants={leftItemVariants} className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.password')}</label>
                        <div className="relative group">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.password && errors.password ? 'text-red-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if (touched.password) { setErrors(prev => ({ ...prev, password: validatePassword(e.target.value), general: undefined })); } }}
                                onBlur={handleBlurPassword}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                                className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-12 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.password && errors.password ? 'border-red-400/60 focus:border-red-400' : 'border-border focus:border-datavibe-primary/50'}`}
                                placeholder="••••••••"
                                disabled={isSubmitting || loginSuccess}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <AnimatePresence>
                            {touched.password && errors.password && (
                                <motion.p initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="text-red-400 text-xs ml-1 font-medium">{errors.password}</motion.p>
                            )}
                        </AnimatePresence>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                {t('auth.forgotPassword')}
                            </button>
                        </div>
                    </motion.div>

                    {/* General error */}
                    <AnimatePresence>
                        {errors.general && (
                            <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-2.5 text-red-400 text-xs font-medium text-center">{errors.general}</motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        variants={rightItemVariants}
                        whileHover={!isSubmitting && !loginSuccess ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting && !loginSuccess ? { scale: 0.98 } : {}}
                        onClick={handleSubmit}
                        disabled={isSubmitting || loginSuccess}
                        className={`w-full h-12 mt-1 rounded-full font-bold text-white transition-all duration-500 flex items-center justify-center gap-2 ${loginSuccess ? 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'bg-gradient-to-r from-datavibe-primary to-datavibe-purple shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]'} ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        <AnimatePresence mode="wait">
                            {loginSuccess ? (
                                <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {t('auth.connected')}</motion.span>
                            ) : isSubmitting ? (
                                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> {t('auth.connecting')}</motion.span>
                            ) : (
                                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{t('auth.signIn')}</motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    
                     <motion.div 
                        variants={leftItemVariants} 
                        className="text-center mt-3 text-sm text-muted-foreground"
                        onAnimationComplete={() => {
                            if (isVisible && !isClosing) {
                                onAnimationComplete?.();
                            }
                        }}
                    >
                        {t('auth.noAccount')} <span className="text-foreground font-bold cursor-pointer hover:underline" onClick={onSignUp}>{t('auth.signUpAction')}</span>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
};