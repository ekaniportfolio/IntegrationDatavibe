import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../language-provider';

// ─── Validation helpers ───
const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);

interface ForgotPasswordCardProps {
    isVisible: boolean;
    isClosing?: boolean;
    delay?: number;
    duration?: number;
    stagger?: number;
    closeDuration?: number;
    closeStagger?: number;
    onBack?: () => void;
    onAnimationComplete?: () => void;
}

export const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({
    isVisible,
    isClosing = false,
    delay = 0.2,
    duration = 0.8,
    stagger = 0.1,
    closeDuration = 0.2,
    closeStagger = 0.05,
    onBack,
    onAnimationComplete,
}) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { t } = useTranslation();

    const SIDE_IN_DURATION = duration;
    const STAGGER_DELAY = stagger;
    const CLOSE_DURATION = closeDuration;
    const EASE_ELASTIC = [0.25, 0.46, 0.45, 0.94];

    // Items entrant depuis la GAUCHE
    const leftItemVariants = {
        hidden: { x: -1000, opacity: 0, filter: 'blur(10px)' },
        visible: {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                x: { duration: SIDE_IN_DURATION, ease: EASE_ELASTIC },
                opacity: { duration: 0.1, ease: 'linear' },
                filter: { duration: SIDE_IN_DURATION },
            },
        },
        exit: {
            x: -1000,
            opacity: 0,
            filter: 'blur(10px)',
            transition: {
                x: { duration: SIDE_IN_DURATION, ease: 'backIn' },
                opacity: { duration: 0.1, delay: SIDE_IN_DURATION - 0.1 },
                filter: { duration: SIDE_IN_DURATION },
            },
        },
        closing: {
            x: -1000,
            opacity: 0,
            filter: 'blur(10px)',
            transition: {
                x: { duration: CLOSE_DURATION, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.1, delay: Math.max(0, CLOSE_DURATION - 0.1) },
                filter: { duration: CLOSE_DURATION },
            },
        },
    };

    // Items entrant depuis la DROITE
    const rightItemVariants = {
        hidden: { x: 1000, opacity: 0, filter: 'blur(10px)' },
        visible: {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                x: { duration: SIDE_IN_DURATION, ease: EASE_ELASTIC },
                opacity: { duration: 0.1, ease: 'linear' },
                filter: { duration: SIDE_IN_DURATION },
            },
        },
        exit: {
            x: 1000,
            opacity: 0,
            filter: 'blur(10px)',
            transition: {
                x: { duration: SIDE_IN_DURATION, ease: 'backIn' },
                opacity: { duration: 0.1, delay: SIDE_IN_DURATION - 0.1 },
                filter: { duration: SIDE_IN_DURATION },
            },
        },
        closing: {
            x: 1000,
            opacity: 0,
            filter: 'blur(10px)',
            transition: {
                x: { duration: CLOSE_DURATION, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.1, delay: Math.max(0, CLOSE_DURATION - 0.1) },
                filter: { duration: CLOSE_DURATION },
            },
        },
    };

    const animationState = isClosing ? 'closing' : isVisible ? 'visible' : 'hidden';

    // ─── Validation ───
    const validateEmail = (value: string): string | undefined => {
        if (!value.trim()) return t('auth.emailRequired');
        if (!isValidEmail(value)) return t('auth.emailInvalid');
        return undefined;
    };

    const handleBlurEmail = () => {
        setTouched({ email: true });
        const error = validateEmail(email);
        setErrors({ email: error });
    };

    const handleSubmit = async () => {
        if (isSubmitting || emailSent) return;

        const emailError = validateEmail(email);
        setTouched({ email: true });
        setErrors({ email: emailError });

        if (emailError) return;

        setIsSubmitting(true);
        setErrors({});

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setEmailSent(true);
        toast.success(t('auth.resetLinkSent'), { description: t('auth.checkInbox') });
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
                        delayChildren: delay,
                    },
                },
                closing: {
                    opacity: 1,
                    transition: {
                        staggerChildren: closeStagger,
                        staggerDirection: -1,
                    },
                },
                exit: {
                    opacity: 1,
                    transition: {
                        staggerChildren: STAGGER_DELAY,
                        staggerDirection: -1,
                        when: 'afterChildren',
                    },
                },
            }}
        >
            <div className="relative z-10 flex flex-col gap-5 p-8 overflow-visible h-full justify-center">

                {/* Header */}
                <motion.div variants={leftItemVariants} className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight font-manrope">
                        {t('auth.forgotPasswordTitle')}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        {emailSent ? t('auth.checkInbox') : t('auth.forgotPasswordDesc')}
                    </p>
                </motion.div>

                {/* Champ email */}
                <motion.div variants={rightItemVariants} className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.email')}</label>
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.email && errors.email ? 'text-red-400' : emailSent ? 'text-emerald-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (touched.email) { setErrors({ email: validateEmail(e.target.value) }); } }}
                            onBlur={handleBlurEmail}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                            className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.email && errors.email ? 'border-red-400/60 focus:border-red-400' : emailSent ? 'border-emerald-400/50' : 'border-border focus:border-datavibe-primary/50'}`}
                            placeholder="nom@entreprise.com"
                            disabled={isSubmitting || emailSent}
                        />
                    </div>
                    <AnimatePresence>
                        {touched.email && errors.email && (
                            <motion.p initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="text-red-400 text-xs ml-1 font-medium">{errors.email}</motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Success message */}
                <AnimatePresence>
                    {emailSent && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-3 flex items-center gap-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <p className="text-emerald-300 text-xs font-medium">{t('auth.checkInbox')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bouton envoi */}
                <motion.button
                    variants={leftItemVariants}
                    whileHover={!isSubmitting && !emailSent ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && !emailSent ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                    disabled={isSubmitting || emailSent}
                    className={`w-full h-12 rounded-full font-bold text-white transition-all duration-500 flex items-center justify-center gap-2 ${emailSent ? 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'bg-gradient-to-r from-datavibe-primary to-datavibe-purple shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]'} ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`}
                >
                    <AnimatePresence mode="wait">
                        {emailSent ? (
                            <motion.span key="sent" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {t('auth.linkSent')}</motion.span>
                        ) : isSubmitting ? (
                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> {t('auth.sending')}</motion.span>
                        ) : (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{t('auth.sendLink')}</motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Retour */}
                <motion.div
                    variants={rightItemVariants}
                    className="flex justify-center"
                    onAnimationComplete={() => {
                        if (isVisible && !isClosing) {
                            onAnimationComplete?.();
                        }
                    }}
                >
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('auth.backToLogin')}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};