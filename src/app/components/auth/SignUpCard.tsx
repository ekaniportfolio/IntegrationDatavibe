import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '../language-provider';

// ─── Validation helpers ───
const isValidEmail = (email: string) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);

const PASSWORD_CRITERIA = [
    { key: 'length', labelKey: 'auth.pwdMinChars', test: (p: string) => p.length >= 8 },
    { key: 'uppercase', labelKey: 'auth.pwdUppercase', test: (p: string) => /[A-Z]/.test(p) },
    { key: 'lowercase', labelKey: 'auth.pwdLowercase', test: (p: string) => /[a-z]/.test(p) },
    { key: 'number', labelKey: 'auth.pwdNumber', test: (p: string) => /[0-9]/.test(p) },
    { key: 'special', labelKey: 'auth.pwdSpecial', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p) },
] as const;

interface SignUpCardProps {
    isVisible: boolean;
    isClosing?: boolean;
    delay?: number;
    duration?: number;
    stagger?: number;
    closeDuration?: number;
    closeStagger?: number;
    onBack?: () => void;
    onAnimationComplete?: () => void;
    onSignUpSuccess?: (firstName: string) => void;
}

export const SignUpCard: React.FC<SignUpCardProps> = ({
    isVisible,
    isClosing = false,
    delay = 0.2,
    duration = 0.8,
    stagger = 0.1,
    closeDuration = 0.2,
    closeStagger = 0.05,
    onBack,
    onAnimationComplete,
    onSignUpSuccess,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileType, setProfileType] = useState<string>('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [updatesSubscription, setUpdatesSubscription] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
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

    const profileOptions = [
        { value: 'Artist', label: t('auth.profileArtist') },
        { value: 'Manager', label: t('auth.profileManager') },
        { value: 'Label', label: t('auth.profileLabel') },
        { value: 'Coach', label: t('auth.profileCoach') },
    ];

    // ─── Password strength ───
    const passwordMet = useMemo(() => PASSWORD_CRITERIA.map(c => c.test(password)), [password]);
    const passwordScore = passwordMet.filter(Boolean).length;
    const passwordStrengthLabel = password.length === 0 ? '' : passwordScore <= 1 ? t('auth.pwdVeryWeak') : passwordScore === 2 ? t('auth.pwdWeak') : passwordScore === 3 ? t('auth.pwdMedium') : passwordScore === 4 ? t('auth.pwdStrong') : t('auth.pwdExcellent');
    const passwordStrengthColor = passwordScore <= 1 ? 'bg-red-500' : passwordScore === 2 ? 'bg-orange-500' : passwordScore === 3 ? 'bg-yellow-500' : passwordScore === 4 ? 'bg-emerald-400' : 'bg-emerald-500';
    const passwordStrengthTextColor = passwordScore <= 1 ? 'text-red-400' : passwordScore === 2 ? 'text-orange-400' : passwordScore === 3 ? 'text-yellow-400' : 'text-emerald-400';

    // ─── Validation ───
    const validateField = (field: string, value: string): string | undefined => {
        switch (field) {
            case 'firstName':
                if (!value.trim()) return t('auth.firstNameRequired');
                if (value.trim().length < 2) return t('auth.firstNameMinChars');
                return undefined;
            case 'lastName':
                if (!value.trim()) return t('auth.lastNameRequired');
                if (value.trim().length < 2) return t('auth.lastNameMinChars');
                return undefined;
            case 'email':
                if (!value.trim()) return t('auth.emailRequired');
                if (!isValidEmail(value)) return t('auth.emailInvalid');
                return undefined;
            case 'password':
                if (!value) return t('auth.passwordRequired');
                if (passwordScore < 5) return t('auth.passwordCriteriaNotMet');
                return undefined;
            case 'profileType':
                if (!value) return t('auth.selectProfileType');
                return undefined;
            default:
                return undefined;
        }
    };

    const handleBlur = (field: string, value: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleChange = (field: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(value);
        if (touched[field]) {
            // Re-validate on every change once touched
            const error = validateField(field, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting || signUpSuccess) return;

        // Force re-evaluate password score with current password
        const currentPasswordMet = PASSWORD_CRITERIA.map(c => c.test(password));
        const currentPasswordScore = currentPasswordMet.filter(Boolean).length;

        // Validate all
        const newErrors: Record<string, string | undefined> = {
            firstName: validateField('firstName', firstName),
            lastName: validateField('lastName', lastName),
            email: validateField('email', email),
            password: !password ? t('auth.passwordRequired') : currentPasswordScore < 5 ? t('auth.passwordCriteriaNotMet') : undefined,
            profileType: validateField('profileType', profileType),
            terms: !termsAccepted ? t('auth.acceptTerms') : undefined,
        };

        setTouched({ firstName: true, lastName: true, email: true, password: true, profileType: true, terms: true });
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) {
            // Find first error and show toast
            const firstError = Object.values(newErrors).find(Boolean);
            if (firstError) toast.error(t('auth.formIncomplete'), { description: firstError });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2200));

        setIsSubmitting(false);
        setSignUpSuccess(true);
        toast.success(t('auth.accountCreatedSuccess'), { description: t('auth.welcomeDatavibe') });

        // Close after brief success display
        setTimeout(() => {
            onSignUpSuccess?.(firstName);
        }, 1200);
    };

    // ─── Inline error component ───
    const FieldError = ({ field }: { field: string }) => (
        <AnimatePresence>
            {touched[field] && errors[field] && (
                <motion.p initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="text-red-400 text-xs ml-1 font-medium">{errors[field]}</motion.p>
            )}
        </AnimatePresence>
    );

    const inputDisabled = isSubmitting || signUpSuccess;

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
            <div className="relative z-10 flex flex-col gap-4 p-8 overflow-visible h-full">

                {/* Header */}
                <motion.div variants={leftItemVariants} className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight font-manrope">
                        {t('auth.createYourAccount')}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        {t('auth.joinDatavibe')}
                    </p>
                </motion.div>

                {/* Prénom */}
                <motion.div variants={rightItemVariants} className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.firstName')}</label>
                    <div className="relative group">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.firstName && errors.firstName ? 'text-red-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => handleChange('firstName', e.target.value, setFirstName)}
                            onBlur={() => handleBlur('firstName', firstName)}
                            className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.firstName && errors.firstName ? 'border-red-400/60 focus:border-red-400' : 'border-border focus:border-datavibe-primary/50'}`}
                            placeholder="Jean"
                            disabled={inputDisabled}
                        />
                    </div>
                    <FieldError field="firstName" />
                </motion.div>

                {/* Nom */}
                <motion.div variants={leftItemVariants} className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.lastName')}</label>
                    <div className="relative group">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.lastName && errors.lastName ? 'text-red-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => handleChange('lastName', e.target.value, setLastName)}
                            onBlur={() => handleBlur('lastName', lastName)}
                            className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.lastName && errors.lastName ? 'border-red-400/60 focus:border-red-400' : 'border-border focus:border-datavibe-primary/50'}`}
                            placeholder="Dupont"
                            disabled={inputDisabled}
                        />
                    </div>
                    <FieldError field="lastName" />
                </motion.div>

                {/* Email */}
                <motion.div variants={rightItemVariants} className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.email')}</label>
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.email && errors.email ? 'text-red-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleChange('email', e.target.value, setEmail)}
                            onBlur={() => handleBlur('email', email)}
                            className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-4 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.email && errors.email ? 'border-red-400/60 focus:border-red-400' : 'border-border focus:border-datavibe-primary/50'}`}
                            placeholder="nom@entreprise.com"
                            disabled={inputDisabled}
                        />
                    </div>
                    <FieldError field="email" />
                </motion.div>

                {/* Mot de passe */}
                <motion.div variants={leftItemVariants} className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.password')}</label>
                    <div className="relative group">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${touched.password && errors.password ? 'text-red-400' : 'text-muted-foreground group-focus-within:text-datavibe-primary'}`} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => handleChange('password', e.target.value, setPassword)}
                            onBlur={() => handleBlur('password', password)}
                            className={`w-full h-12 bg-foreground/[0.06] border rounded-2xl pl-12 pr-12 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:bg-foreground/[0.08] transition-all duration-300 ${touched.password && errors.password ? 'border-red-400/60 focus:border-red-400' : 'border-border focus:border-datavibe-primary/50'}`}
                            placeholder="••••••••"
                            disabled={inputDisabled}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password strength gauge */}
                    <AnimatePresence>
                        {password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-2 ml-1"
                            >
                                {/* Strength bar */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex gap-0.5">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 h-full rounded-full transition-all duration-300 ${i < passwordScore ? passwordStrengthColor : 'bg-transparent'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs font-semibold ${passwordStrengthTextColor} min-w-[70px] text-right transition-colors duration-300`}>{passwordStrengthLabel}</span>
                                </div>

                                {/* Criteria checklist */}
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                    {PASSWORD_CRITERIA.map((criteria, i) => (
                                        <div key={criteria.key} className="flex items-center gap-1.5">
                                            <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300 ${passwordMet[i] ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                                {passwordMet[i] && (
                                                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-medium transition-colors duration-300 ${passwordMet[i] ? 'text-emerald-400' : 'text-muted-foreground'}`}>{t(criteria.labelKey)}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Type de profil */}
                <motion.div variants={rightItemVariants} className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-foreground/80 tracking-wider ml-1">{t('auth.iAm')}</p>
                    <div className="flex flex-wrap gap-2">
                        {profileOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all duration-300 ${
                                    profileType === option.value
                                        ? 'bg-datavibe-primary/20 border-datavibe-primary/50 text-foreground'
                                        : touched.profileType && errors.profileType
                                        ? 'bg-foreground/[0.04] border-red-400/40 text-muted-foreground hover:bg-foreground/[0.06]'
                                        : 'bg-foreground/[0.04] border-border text-muted-foreground hover:bg-foreground/[0.06] hover:border-foreground/20'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="profileType"
                                    value={option.value}
                                    checked={profileType === option.value}
                                    onChange={(e) => {
                                        setProfileType(e.target.value);
                                        setTouched(prev => ({ ...prev, profileType: true }));
                                        setErrors(prev => ({ ...prev, profileType: undefined }));
                                    }}
                                    className="sr-only"
                                    disabled={inputDisabled}
                                />
                                <span className="text-sm font-semibold">{option.label}</span>
                            </label>
                        ))}
                    </div>
                    <FieldError field="profileType" />
                </motion.div>

                {/* Conditions d'utilisation */}
                <motion.div variants={leftItemVariants} className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setTermsAccepted(!termsAccepted);
                            setTouched(prev => ({ ...prev, terms: true }));
                            if (!termsAccepted) setErrors(prev => ({ ...prev, terms: undefined }));
                            else setErrors(prev => ({ ...prev, terms: t('auth.acceptTerms') }));
                        }}
                        disabled={inputDisabled}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            termsAccepted
                                ? 'bg-datavibe-primary border-datavibe-primary'
                                : touched.terms && errors.terms
                                ? 'bg-black/20 border-red-400/50 hover:border-red-400/70'
                                : 'bg-black/20 border-white/20 hover:border-white/40'
                        }`}
                    >
                        {termsAccepted && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                    <span className={`text-xs ${touched.terms && errors.terms ? 'text-red-400' : 'text-muted-foreground'} transition-colors duration-300`}>
                        {t('auth.iAcceptThe')}{' '}
                        <a href="/landing/legal" target="_blank" className="text-datavibe-primary hover:underline">{t('auth.termsOfUse')}</a>
                        {' '}{t('auth.andThe')}{' '}
                        <a href="/landing/legal" target="_blank" className="text-datavibe-primary hover:underline">{t('auth.privacyPolicy')}</a>
                    </span>
                </motion.div>

                {/* Newsletter */}
                <motion.div variants={rightItemVariants} className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => setUpdatesSubscription(!updatesSubscription)}
                        disabled={inputDisabled}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            updatesSubscription
                                ? 'bg-datavibe-primary border-datavibe-primary'
                                : 'bg-black/20 border-white/20 hover:border-white/40'
                        }`}
                    >
                        {updatesSubscription && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                    <span className="text-xs text-muted-foreground">
                        {t('auth.receiveUpdates')}
                    </span>
                </motion.div>

                {/* Bouton Créer le compte */}
                <motion.button
                    variants={leftItemVariants}
                    whileHover={!isSubmitting && !signUpSuccess ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && !signUpSuccess ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                    disabled={isSubmitting || signUpSuccess}
                    className={`w-full h-12 rounded-full font-bold text-white transition-all duration-500 flex items-center justify-center gap-2 ${signUpSuccess ? 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'bg-gradient-to-r from-datavibe-primary to-datavibe-purple shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)]'} ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`}
                >
                    <AnimatePresence mode="wait">
                        {signUpSuccess ? (
                            <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {t('auth.accountCreated')}</motion.span>
                        ) : isSubmitting ? (
                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> {t('auth.creating')}</motion.span>
                        ) : (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{t('auth.createMyAccount')}</motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Retour à la connexion */}
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
                        {t('auth.haveAccountSignIn')}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};