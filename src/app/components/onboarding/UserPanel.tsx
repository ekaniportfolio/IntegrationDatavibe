import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Settings, Bell, Palette, LogOut, Shield, CreditCard, ChevronRight, ChevronLeft, Mail, Calendar, Check, X, Sun, Moon, Monitor, Download, Trash2, Eye, EyeOff, Save, Camera } from "lucide-react";
import { useTranslation } from "../language-provider";

const PROFILE_IMAGE = "https://images.unsplash.com/photo-1668752600261-e56e7f3780b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzE1NjMxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
export { PROFILE_IMAGE };

// ─── Spatial Flow Variants ───
const SPATIAL_FLOW_DURATION = 0.35;
const SPATIAL_FLOW_EASE = [0.4, 0, 0.2, 1] as const;

const spatialFlowVariants = {
    initial: (direction: number) => ({
        x: `${direction * 100}%`,
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: SPATIAL_FLOW_DURATION, ease: SPATIAL_FLOW_EASE },
    },
    exit: (direction: number) => ({
        x: `${direction * -100}%`,
        opacity: 0,
        transition: { duration: SPATIAL_FLOW_DURATION, ease: SPATIAL_FLOW_EASE },
    }),
};

// ─── Types ───
type SectionId = 'main' | 'profile' | 'email' | 'subscription' | 'security' | 'notifications' | 'appearance' | 'reports' | 'advanced';

interface UserPanelProps {
    isOpen: boolean;
    onLogout: () => void;
    displayName: string;
    userEmail?: string;
    onDisplayNameChange?: (name: string) => void;
}

// ─── Sub-header with back button ───
const SubHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/30">
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
        >
            <ChevronLeft className="w-4 h-4 text-foreground" />
        </motion.button>
        <span className="text-foreground font-manrope" style={{ fontSize: '16px', fontWeight: 700 }}>{title}</span>
    </div>
);

// ─── Toggle Switch ───
const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${enabled ? 'bg-datavibe-primary' : 'bg-muted/60 border border-border/50'}`}>
        <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
    </button>
);

// ─── Reusable form input ───
const FormInput = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
        <label className="text-muted-foreground font-manrope" style={{ fontSize: '12px', fontWeight: 600 }}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-xl bg-muted/30 border border-border/40 text-foreground font-manrope placeholder:text-muted-foreground/40 focus:outline-none focus:border-datavibe-primary/50 focus:ring-1 focus:ring-datavibe-primary/20 transition-all"
            style={{ fontSize: '14px' }}
        />
    </div>
);

// ─── Action button ───
const ActionButton = ({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick: () => void; variant?: "primary" | "danger" | "muted" }) => {
    const classes = variant === "primary"
        ? "bg-datavibe-primary hover:bg-datavibe-primary/90 text-white"
        : variant === "danger"
        ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
        : "bg-muted/40 hover:bg-muted/60 text-foreground border border-border/30";
    return (
        <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} className={`w-full py-3 rounded-xl font-manrope cursor-pointer transition-colors flex items-center justify-center gap-2 ${classes}`} style={{ fontSize: '14px', fontWeight: 600 }}>
            {children}
        </motion.button>
    );
};

// ─── Settings Row ───
const SettingsRow = ({ icon: Icon, label, value, onClick, delay }: { icon: any; label: string; value?: string; onClick?: () => void; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay }}
        onClick={onClick}
        className="flex items-center justify-between py-3 px-1 border-b border-border/30 last:border-none cursor-pointer hover:bg-muted/30 rounded-lg transition-colors group"
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-foreground font-manrope" style={{ fontSize: '14px' }}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-muted-foreground font-manrope" style={{ fontSize: '12px' }}>{value}</span>}
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
        </div>
    </motion.div>
);

// ═══════════════════════════════════════════
// SECTION VIEWS
// ═══════════════════════════════════════════

// ─── Profile Section ───
function ProfileSection({ displayName, userEmail, onBack, onSave }: { displayName: string; userEmail: string; onBack: () => void; onSave: (firstName: string, lastName: string) => void }) {
    const parts = displayName.split(" ");
    const [firstName, setFirstName] = useState(parts[0] || "");
    const [lastName, setLastName] = useState(parts.slice(1).join(" ") || "");
    const [saved, setSaved] = useState(false);
    const { t } = useTranslation();

    const handleSave = () => {
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        if (fullName) {
            onSave(firstName.trim(), lastName.trim());
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.profile')} onBack={onBack} />
            <div className="px-5 py-5 space-y-5">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-datavibe-primary/30 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                            <img src={PROFILE_IMAGE} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-datavibe-primary flex items-center justify-center shadow-md cursor-pointer">
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                </div>
                <FormInput label={t('user.yourFirstName')} value={firstName} onChange={setFirstName} placeholder={t('user.yourFirstName')} />
                <FormInput label={t('user.lastName')} value={lastName} onChange={setLastName} placeholder={t('user.yourLastName')} />
                <FormInput label={t('user.email')} value={userEmail} onChange={() => {}} type="email" placeholder="email@example.com" />
                <ActionButton onClick={handleSave} variant={saved ? "muted" : "primary"}>
                    {saved ? <><Check className="w-4 h-4" /> {t('user.saved')}</> : <><Save className="w-4 h-4" /> {t('user.save')}</>}
                </ActionButton>
            </div>
        </motion.div>
    );
}

// ─── Email Section ───
function EmailSection({ userEmail, onBack }: { userEmail: string; onBack: () => void }) {
    const [newEmail, setNewEmail] = useState(userEmail);
    const [confirmEmail, setConfirmEmail] = useState("");
    const [saved, setSaved] = useState(false);
    const { t } = useTranslation();

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.email')} onBack={onBack} />
            <div className="px-5 py-5 space-y-5">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-manrope" style={{ fontSize: '13px' }}>{t('user.emailVerified')}</span>
                </div>
                <FormInput label={t('user.currentEmail')} value={userEmail} onChange={() => {}} />
                <FormInput label={t('user.newEmail')} value={newEmail} onChange={setNewEmail} type="email" placeholder="new@email.com" />
                <FormInput label={t('user.confirm')} value={confirmEmail} onChange={setConfirmEmail} type="email" placeholder={t('user.confirmNewEmail')} />
                <ActionButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} variant={saved ? "muted" : "primary"}>
                    {saved ? <><Check className="w-4 h-4" /> {t('user.linkSent')}</> : t('user.sendVerificationLink')}
                </ActionButton>
            </div>
        </motion.div>
    );
}

// ─── Subscription Section ───
function SubscriptionSection({ onBack }: { onBack: () => void }) {
    const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
    const { t } = useTranslation();
    const plans = [
        { id: 'free' as const, name: 'Free', price: '0€', features: [t('user.sub.oneArtist'), t('user.sub.basicReports'), t('user.sub.emailAlerts')] },
        { id: 'pro' as const, name: 'Pro', price: '19€/mois', features: [t('user.sub.unlimited'), t('user.sub.advancedReports'), t('user.sub.realTimeAlerts'), t('user.sub.pdfExport')], current: true },
        { id: 'enterprise' as const, name: 'Enterprise', price: '49€/mois', features: [t('user.sub.allPro'), 'API access', t('user.sub.dedicatedSupport'), t('user.sub.multiLabel')] },
    ];

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.subscription')} onBack={onBack} />
            <div className="px-5 py-5 space-y-3">
                {plans.map(p => (
                    <motion.div
                        key={p.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPlan(p.id)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all ${plan === p.id ? 'border-datavibe-primary/50 bg-datavibe-primary/5 shadow-[0_0_15px_rgba(79,57,246,0.1)]' : 'border-border/30 bg-muted/10 hover:bg-muted/20'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-foreground font-manrope" style={{ fontSize: '15px', fontWeight: 700 }} translate="no">{p.name}</span>
                                {p.current && <span className="px-2 py-0.5 rounded-full bg-datavibe-primary/15 text-datavibe-primary font-manrope" style={{ fontSize: '10px', fontWeight: 700 }}>{t('user.sub.current')}</span>}
                            </div>
                            <span className="text-foreground font-manrope" style={{ fontSize: '14px', fontWeight: 600 }}>{p.price}</span>
                        </div>
                        <div className="space-y-1">
                            {p.features.map(f => (
                                <div key={f} className="flex items-center gap-2">
                                    <Check className={`w-3 h-3 ${plan === p.id ? 'text-datavibe-primary' : 'text-muted-foreground/50'}`} />
                                    <span className="text-muted-foreground font-manrope" style={{ fontSize: '12px' }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Security Section ───
function SecuritySection({ onBack }: { onBack: () => void }) {
    const [oldPw, setOldPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [saved, setSaved] = useState(false);
    const match = newPw.length > 0 && newPw === confirmPw;
    const strong = newPw.length >= 8 && /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) && /[!@#$%^&*]/.test(newPw);
    const { t } = useTranslation();

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.security')} onBack={onBack} />
            <div className="px-5 py-5 space-y-5">
                <div className="space-y-1.5">
                    <label className="text-muted-foreground font-manrope" style={{ fontSize: '12px', fontWeight: 600 }}>{t('user.currentPassword')}</label>
                    <div className="relative">
                        <input type={showOld ? "text" : "password"} value={oldPw} onChange={e => setOldPw(e.target.value)} className="w-full px-3 py-2.5 pr-10 rounded-xl bg-muted/30 border border-border/40 text-foreground font-manrope focus:outline-none focus:border-datavibe-primary/50 transition-all" style={{ fontSize: '14px' }} />
                        <button onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 cursor-pointer">{showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-muted-foreground font-manrope" style={{ fontSize: '12px', fontWeight: 600 }}>{t('user.newPassword')}</label>
                    <div className="relative">
                        <input type={showNew ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full px-3 py-2.5 pr-10 rounded-xl bg-muted/30 border border-border/40 text-foreground font-manrope focus:outline-none focus:border-datavibe-primary/50 transition-all" style={{ fontSize: '14px' }} />
                        <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 cursor-pointer">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                    {newPw.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`h-1 flex-1 rounded-full ${strong ? 'bg-emerald-400' : newPw.length >= 6 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                            <span className={`font-manrope ${strong ? 'text-emerald-400' : newPw.length >= 6 ? 'text-yellow-400' : 'text-red-400'}`} style={{ fontSize: '11px' }}>{strong ? t('user.strong') : newPw.length >= 6 ? t('user.medium') : t('user.weak')}</span>
                        </div>
                    )}
                </div>
                <FormInput label={t('user.confirm')} value={confirmPw} onChange={setConfirmPw} type="password" placeholder={t('user.confirmPassword')} />
                {confirmPw.length > 0 && !match && <p className="text-red-400 font-manrope" style={{ fontSize: '12px' }}>{t('user.passwordsDontMatch')}</p>}
                <ActionButton onClick={() => { if (match && strong && oldPw) { setSaved(true); setTimeout(() => setSaved(false), 2000); } }} variant={saved ? "muted" : "primary"}>
                    {saved ? <><Check className="w-4 h-4" /> {t('user.changed')}</> : t('user.changePassword')}
                </ActionButton>
            </div>
        </motion.div>
    );
}

// ─── Notifications Section ───
function NotificationsSection({ onBack }: { onBack: () => void }) {
    const [notifs, setNotifs] = useState({
        newRelease: true, weeklyReport: true, priceAlert: true,
        trendAlert: false, marketing: false, socialMentions: true,
    });
    const toggle = (key: keyof typeof notifs) => setNotifs(p => ({ ...p, [key]: !p[key] }));
    const { t } = useTranslation();
    const rows = [
        { key: 'newRelease' as const, label: t('user.notif.newRelease'), desc: t('user.notif.newReleaseDesc') },
        { key: 'weeklyReport' as const, label: t('user.notif.weeklyReport'), desc: t('user.notif.weeklyReportDesc') },
        { key: 'priceAlert' as const, label: t('user.notif.streamAlerts'), desc: t('user.notif.streamAlertsDesc') },
        { key: 'trendAlert' as const, label: t('user.notif.trends'), desc: t('user.notif.trendsDesc') },
        { key: 'socialMentions' as const, label: t('user.notif.socialMentions'), desc: t('user.notif.socialMentionsDesc') },
        { key: 'marketing' as const, label: t('user.notif.promotions'), desc: t('user.notif.promotionsDesc') },
    ];

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.notifications')} onBack={onBack} />
            <div className="px-5 py-4 space-y-1">
                {rows.map(r => (
                    <div key={r.key} className="flex items-center justify-between py-3 border-b border-border/20 last:border-none">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-foreground font-manrope" style={{ fontSize: '14px' }}>{r.label}</p>
                            <p className="text-muted-foreground/60 font-manrope" style={{ fontSize: '11px' }}>{r.desc}</p>
                        </div>
                        <Toggle enabled={notifs[r.key]} onToggle={() => toggle(r.key)} />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Appearance Section ───
function AppearanceSection({ onBack }: { onBack: () => void }) {
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
    const { t } = useTranslation();
    const themes = [
        { id: 'light' as const, label: t('user.theme.light'), icon: Sun, desc: t('user.theme.lightDesc') },
        { id: 'dark' as const, label: t('user.theme.dark'), icon: Moon, desc: t('user.theme.darkDesc') },
        { id: 'auto' as const, label: t('user.theme.auto'), icon: Monitor, desc: t('user.theme.autoDesc') },
    ];

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.appearance')} onBack={onBack} />
            <div className="px-5 py-5 space-y-3">
                {themes.map(th => (
                    <motion.div
                        key={th.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTheme(th.id)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all flex items-center gap-4 ${theme === th.id ? 'border-datavibe-primary/50 bg-datavibe-primary/5' : 'border-border/30 bg-muted/10 hover:bg-muted/20'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === th.id ? 'bg-datavibe-primary/20' : 'bg-muted/40'}`}>
                            <th.icon className={`w-5 h-5 ${theme === th.id ? 'text-datavibe-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-foreground font-manrope" style={{ fontSize: '14px', fontWeight: 600 }}>{th.label}</p>
                            <p className="text-muted-foreground/60 font-manrope" style={{ fontSize: '12px' }}>{th.desc}</p>
                        </div>
                        {theme === th.id && <Check className="w-5 h-5 text-datavibe-primary" />}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Reports Section ───
function ReportsSection({ onBack }: { onBack: () => void }) {
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeComparison, setIncludeComparison] = useState(true);
    const [autoExport, setAutoExport] = useState(false);
    const { t } = useTranslation();
    const freqs = [
        { id: 'daily' as const, label: t('user.report.daily'), desc: t('user.report.dailyDesc') },
        { id: 'weekly' as const, label: t('user.report.weeklyLabel'), desc: t('user.report.weeklyDesc') },
        { id: 'monthly' as const, label: t('user.report.monthlyLabel'), desc: t('user.report.monthlyDesc') },
    ];

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.reports')} onBack={onBack} />
            <div className="px-5 py-5 space-y-5">
                <div>
                    <p className="text-muted-foreground/60 font-manrope mb-3" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>{t('user.report.frequency')}</p>
                    <div className="space-y-2">
                        {freqs.map(f => (
                            <motion.div key={f.id} whileTap={{ scale: 0.98 }} onClick={() => setFrequency(f.id)} className={`rounded-xl border p-3.5 cursor-pointer transition-all flex items-center justify-between ${frequency === f.id ? 'border-datavibe-primary/50 bg-datavibe-primary/5' : 'border-border/30 bg-muted/10'}`}>
                                <div>
                                    <p className="text-foreground font-manrope" style={{ fontSize: '14px', fontWeight: 500 }}>{f.label}</p>
                                    <p className="text-muted-foreground/60 font-manrope" style={{ fontSize: '11px' }}>{f.desc}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${frequency === f.id ? 'border-datavibe-primary' : 'border-muted-foreground/30'}`}>
                                    {frequency === f.id && <div className="w-2.5 h-2.5 rounded-full bg-datavibe-primary" />}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground/60 font-manrope mb-3" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>{t('user.report.options')}</p>
                    <div className="space-y-1">
                        {[
                            { label: t('user.report.includeCharts'), enabled: includeCharts, toggle: () => setIncludeCharts(!includeCharts) },
                            { label: t('user.report.comparison'), enabled: includeComparison, toggle: () => setIncludeComparison(!includeComparison) },
                            { label: t('user.report.autoExport'), enabled: autoExport, toggle: () => setAutoExport(!autoExport) },
                        ].map(opt => (
                            <div key={opt.label} className="flex items-center justify-between py-3 border-b border-border/20 last:border-none">
                                <span className="text-foreground font-manrope" style={{ fontSize: '14px' }}>{opt.label}</span>
                                <Toggle enabled={opt.enabled} onToggle={opt.toggle} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Advanced Section ───
function AdvancedSection({ onBack }: { onBack: () => void }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [exportStarted, setExportStarted] = useState(false);
    const { t } = useTranslation();

    return (
        <motion.div variants={spatialFlowVariants} initial="initial" animate="animate" exit="exit" custom={1}>
            <SubHeader title={t('user.advanced')} onBack={onBack} />
            <div className="px-5 py-5 space-y-4">
                <ActionButton onClick={() => { setExportStarted(true); setTimeout(() => setExportStarted(false), 3000); }} variant="muted">
                    <Download className="w-4 h-4" /> {exportStarted ? t('user.exporting') : t('user.exportData')}
                </ActionButton>
                <div className="border-t border-border/20 pt-4">
                    <p className="text-muted-foreground/60 font-manrope mb-3" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>{t('user.dangerZone')}</p>
                    {!showDeleteConfirm ? (
                        <ActionButton onClick={() => setShowDeleteConfirm(true)} variant="danger">
                            <Trash2 className="w-4 h-4" /> {t('user.deleteAccount')}
                        </ActionButton>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                            <p className="text-red-400 font-manrope" style={{ fontSize: '13px' }}>{t('user.deleteWarning')}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-muted/40 text-foreground font-manrope cursor-pointer hover:bg-muted/60 transition-colors flex items-center justify-center gap-1" style={{ fontSize: '13px' }}>
                                    <X className="w-3.5 h-3.5" /> {t('common.cancel')}
                                </button>
                                <button className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-manrope cursor-pointer hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1 border border-red-500/30" style={{ fontSize: '13px' }}>
                                    <Trash2 className="w-3.5 h-3.5" /> {t('common.confirm')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════
// MAIN USER PANEL
// ═══════════════════════════════════════════
export function UserPanel({ isOpen, onLogout, displayName, userEmail = "ksbloom@datavibe.com", onDisplayNameChange }: UserPanelProps) {
    const [activeSection, setActiveSection] = useState<SectionId>('main');
    const directionRef = useRef<number>(1);
    const { t } = useTranslation();

    const navigateTo = (section: SectionId) => {
        directionRef.current = 1; // forward: main exits left, sub enters from right
        setActiveSection(section);
    };

    const goBack = () => {
        directionRef.current = -1; // backward: sub exits right, main enters from left
        setActiveSection('main');
    };

    // Get current values for display
    const notifStatus = t('user.active');
    const themeStatus = t('user.auto');
    const reportStatus = t('user.weekly');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="user-panel-content"
                    initial={{ x: "-110%", opacity: 0.8 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-110%", opacity: 0.8 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden"
                >
                    <AnimatePresence mode="wait" custom={directionRef.current}>
                        {activeSection === 'main' ? (
                            <motion.div key="main" variants={spatialFlowVariants} custom={directionRef.current} initial="initial" animate="animate" exit="exit">
                                {/* Profile Header — PRO badge only */}
                                <div className="relative px-5 pt-6 pb-5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-datavibe-primary/10 via-transparent to-datavibe-purple/5 pointer-events-none" />
                                    <div className="relative flex items-center justify-start">
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 rounded-full bg-datavibe-primary/15 border border-datavibe-primary/20 flex items-center justify-center">
                                                <span className="text-datavibe-primary font-manrope" style={{ fontSize: '11px', fontWeight: 700 }}>PRO</span>
                                            </div>
                                            <span className="text-muted-foreground/60 font-manrope" style={{ fontSize: '11px' }}>{t('user.memberSince')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="px-5 pb-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: t('user.artists'), value: "12" },
                                            { label: t('user.reports'), value: "47" },
                                            { label: t('user.alerts'), value: "3" }
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                                                className="bg-muted/40 rounded-xl p-3 text-center border border-border/30"
                                            >
                                                <p className="text-foreground font-manrope" style={{ fontSize: '20px', fontWeight: 700 }}>{stat.value}</p>
                                                <p className="text-muted-foreground font-manrope" style={{ fontSize: '11px' }}>{stat.label}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* COMPTE */}
                                <div className="px-5 pb-3">
                                    <p className="text-muted-foreground/60 font-manrope mb-2 px-1" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>{t('user.account')}</p>
                                    <div className="bg-muted/20 rounded-xl px-3 py-1 border border-border/20">
                                        <SettingsRow icon={User} label={t('user.profile')} value={t('user.modify')} delay={0.2} onClick={() => navigateTo('profile')} />
                                        <SettingsRow icon={Mail} label={t('user.email')} value={t('user.verified')} delay={0.25} onClick={() => navigateTo('email')} />
                                        <SettingsRow icon={CreditCard} label={t('user.subscription')} value="Pro" delay={0.3} onClick={() => navigateTo('subscription')} />
                                        <SettingsRow icon={Shield} label={t('user.security')} delay={0.35} onClick={() => navigateTo('security')} />
                                    </div>
                                </div>

                                {/* PREFERENCES */}
                                <div className="px-5 pb-3">
                                    <p className="text-muted-foreground/60 font-manrope mb-2 px-1" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>{t('user.preferences')}</p>
                                    <div className="bg-muted/20 rounded-xl px-3 py-1 border border-border/20">
                                        <SettingsRow icon={Bell} label={t('user.notifications')} value={notifStatus} delay={0.4} onClick={() => navigateTo('notifications')} />
                                        <SettingsRow icon={Palette} label={t('user.appearance')} value={themeStatus} delay={0.45} onClick={() => navigateTo('appearance')} />
                                        <SettingsRow icon={Calendar} label={t('user.reports')} value={reportStatus} delay={0.5} onClick={() => navigateTo('reports')} />
                                        <SettingsRow icon={Settings} label={t('user.advanced')} delay={0.55} onClick={() => navigateTo('advanced')} />
                                    </div>
                                </div>

                                {/* Logout */}
                                <div className="px-5 pb-6 pt-2">
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={onLogout}
                                        className="w-full py-3.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer group"
                                    >
                                        <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                                        <span className="text-red-400 group-hover:text-red-300 font-manrope transition-colors" style={{ fontSize: '14px', fontWeight: 600 }}>{t('user.logout')}</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : activeSection === 'profile' ? (
                            <ProfileSection key="profile" displayName={displayName} userEmail={userEmail} onBack={goBack} onSave={(fn, ln) => { onDisplayNameChange?.(`${fn} ${ln}`.trim()); goBack(); }} />
                        ) : activeSection === 'email' ? (
                            <EmailSection key="email" userEmail={userEmail} onBack={goBack} />
                        ) : activeSection === 'subscription' ? (
                            <SubscriptionSection key="subscription" onBack={goBack} />
                        ) : activeSection === 'security' ? (
                            <SecuritySection key="security" onBack={goBack} />
                        ) : activeSection === 'notifications' ? (
                            <NotificationsSection key="notifications" onBack={goBack} />
                        ) : activeSection === 'appearance' ? (
                            <AppearanceSection key="appearance" onBack={goBack} />
                        ) : activeSection === 'reports' ? (
                            <ReportsSection key="reports" onBack={goBack} />
                        ) : activeSection === 'advanced' ? (
                            <AdvancedSection key="advanced" onBack={goBack} />
                        ) : null}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}