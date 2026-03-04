import { motion, AnimatePresence, useDragControls, type PanInfo } from "motion/react";
import { useState, useCallback, useRef } from "react";
import {
    Send, X, FileText, FileSpreadsheet, HardDriveDownload,
    Mail, Table, ChevronRight, CheckCircle2
} from "lucide-react";
import { useTranslation } from "../language-provider";

/**
 * ============================================================================
 * SHARE BILAN BUTTON — "Partager mon bilan" with animated border beams
 * + Bottom Sheet export menu (PDF, Excel, Local, Email, Table)
 * ============================================================================
 *
 * Themed per Bilan tab:
 *   - streaming: orange (#F28E42)
 *   - social:    green  (#1CB45B)
 *   - media:     blue   (#1286F3)
 *
 * Bottom Sheet (inspired by LinkedIn/mobile share sheets):
 *   - Slides up from bottom with spring animation
 *   - Backdrop click or drag-down to dismiss
 *   - Handle bar for visual affordance
 *   - Export options grouped by category
 *   - Theme-aware accent colors
 * ============================================================================
 */

type BilanTheme = "streaming" | "social" | "media";

const THEME_CONFIG: Record<BilanTheme, {
    accent: string;
    accentRgba: string;
    borderColor: string;
    bgColor: string;
    glowColor: string;
}> = {
    streaming: {
        accent: "#F28E42",
        accentRgba: "rgba(242, 142, 66, 0.25)",
        borderColor: "rgba(242, 142, 66, 0.4)",
        bgColor: "rgba(242, 142, 66, 0.12)",
        glowColor: "rgba(242, 142, 66, 0.25)",
    },
    social: {
        accent: "#1CB45B",
        accentRgba: "rgba(28, 180, 91, 0.25)",
        borderColor: "rgba(28, 180, 91, 0.4)",
        bgColor: "rgba(28, 180, 91, 0.12)",
        glowColor: "rgba(28, 180, 91, 0.25)",
    },
    media: {
        accent: "#1286F3",
        accentRgba: "rgba(18, 134, 243, 0.25)",
        borderColor: "rgba(18, 134, 243, 0.4)",
        bgColor: "rgba(18, 134, 243, 0.12)",
        glowColor: "rgba(18, 134, 243, 0.25)",
    },
};

/* ─── Export option types ─── */
type ExportAction = "pdf" | "excel" | "local" | "email" | "table";

interface ExportOption {
    id: ExportAction;
    label: string;
    description: string;
    icon: typeof FileText;
}

/* ─── Dismiss threshold ─── */
const DRAG_CLOSE_THRESHOLD = 100; // px dragged down to dismiss

interface ShareBilanButtonProps {
    theme: BilanTheme;
    onClick?: () => void;
}

export function ShareBilanButton({ theme, onClick }: ShareBilanButtonProps) {
    const config = THEME_CONFIG[theme];
    const { t } = useTranslation();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ExportAction | null>(null);
    const [confirmingAction, setConfirmingAction] = useState<ExportAction | null>(null);
    const dragControls = useDragControls();
    const sheetRef = useRef<HTMLDivElement>(null);

    const THEME_LABELS_T: Record<BilanTheme, string> = {
        streaming: "Streaming",
        social: t("share.socialLabel"),
        media: t("share.mediaLabel"),
    };

    const EXPORT_OPTIONS_T: ExportOption[] = [
        { id: "pdf", label: t("share.exportPdf"), description: t("share.exportPdfDesc"), icon: FileText },
        { id: "excel", label: t("share.exportExcel"), description: t("share.exportExcelDesc"), icon: FileSpreadsheet },
        { id: "table", label: t("share.copyTable"), description: t("share.copyTableDesc"), icon: Table },
        { id: "local", label: t("share.downloadLocal"), description: t("share.downloadLocalDesc"), icon: HardDriveDownload },
        { id: "email", label: t("share.sendEmail"), description: t("share.sendEmailDesc"), icon: Mail },
    ];

    const handleOpen = useCallback(() => {
        setIsSheetOpen(true);
        setSelectedAction(null);
        setConfirmingAction(null);
        onClick?.();
    }, [onClick]);

    const handleClose = useCallback(() => {
        setIsSheetOpen(false);
        setSelectedAction(null);
        setConfirmingAction(null);
    }, []);

    const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
        if (info.offset.y > DRAG_CLOSE_THRESHOLD || info.velocity.y > 500) {
            handleClose();
        }
    }, [handleClose]);

    const handleExportClick = useCallback((action: ExportAction) => {
        setSelectedAction(action);
        setConfirmingAction(action);
        // Simulate export action — brief confirmation then auto-close
        setTimeout(() => {
            setConfirmingAction(null);
            setTimeout(() => {
                handleClose();
            }, 600);
        }, 1500);
    }, [handleClose]);

    return (
        <>
            {/* ─── Trigger Button (unchanged visual) ─── */}
            <div className="relative flex items-center justify-center w-full py-6">
                <motion.button
                    onClick={handleOpen}
                    className="relative group overflow-hidden flex items-center justify-center h-[48px] px-8 rounded-[8px] cursor-pointer backdrop-blur-sm w-full md:w-auto md:max-w-[280px]"
                    style={{
                        backgroundColor: config.bgColor,
                        touchAction: "manipulation",
                    }}
                    whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${config.glowColor}` }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    {/* Animated border beams — 4 edges */}
                    {/* Top edge: left → right */}
                    <motion.span
                        className="absolute top-0 left-0 w-full h-[1px]"
                        style={{ background: `linear-gradient(to right, transparent, ${config.accent}, transparent)` }}
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    {/* Bottom edge: right → left */}
                    <motion.span
                        className="absolute bottom-0 left-0 w-full h-[1px]"
                        style={{ background: `linear-gradient(to right, transparent, ${config.accent}, transparent)` }}
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    {/* Right edge: top → bottom */}
                    <motion.span
                        className="absolute top-0 right-0 h-full w-[1px]"
                        style={{ background: `linear-gradient(to bottom, transparent, ${config.accent}, transparent)` }}
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }}
                    />
                    {/* Left edge: bottom → top */}
                    <motion.span
                        className="absolute top-0 left-0 h-full w-[1px]"
                        style={{ background: `linear-gradient(to bottom, transparent, ${config.accent}, transparent)` }}
                        animate={{ y: ["100%", "-100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }}
                    />

                    {/* Static border overlay */}
                    <span
                        className="absolute inset-0 rounded-[8px] pointer-events-none"
                        style={{ border: `1px solid ${config.borderColor}` }}
                    />

                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-2.5">
                        <span className="font-manrope font-bold text-[14px] tracking-wider text-white whitespace-nowrap">
                            {t("share.shareMyBilan")}
                        </span>
                        <Send size={16} className="text-white" style={{ color: config.accent }} strokeWidth={2.5} />
                    </span>
                </motion.button>
            </div>

            {/* ─── Bottom Sheet Portal ─── */}
            <AnimatePresence>
                {isSheetOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-[6px] z-[300]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={handleClose}
                        />

                        {/* Sheet */}
                        <motion.div
                            ref={sheetRef}
                            className="fixed bottom-0 left-0 right-0 z-[301] max-w-[500px] mx-auto"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            drag="y"
                            dragControls={dragControls}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0.05, bottom: 0.6 }}
                            onDragEnd={handleDragEnd}
                            style={{ touchAction: "none" }}
                        >
                            {/* Sheet body */}
                            <div
                                className="rounded-t-[24px] overflow-hidden"
                                style={{
                                    background: "linear-gradient(180deg, #141019 0%, #0d0a14 100%)",
                                    borderTop: `1px solid ${config.borderColor}`,
                                }}
                            >
                                {/* Drag handle */}
                                <div
                                    className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
                                    onPointerDown={(e) => dragControls.start(e)}
                                >
                                    <div
                                        className="w-10 h-[4px] rounded-full"
                                        style={{ backgroundColor: `${config.accent}40` }}
                                    />
                                </div>

                                <div className="px-5 pb-8 pt-2 flex flex-col gap-5">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-manrope font-bold text-[17px] text-white">
                                                {t("share.exportMyBilan")}
                                            </p>
                                            <p className="font-manrope font-normal text-[12px] text-white/40">
                                                Bilan {THEME_LABELS_T[theme]} — {t("share.chooseFormat")}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
                                            style={{ backgroundColor: `${config.accent}15` }}
                                        >
                                            <X className="w-4 h-4 text-white/60" />
                                        </button>
                                    </div>

                                    {/* Separator */}
                                    <div
                                        className="h-px w-full"
                                        style={{ background: `linear-gradient(to right, transparent, ${config.accent}30, transparent)` }}
                                    />

                                    {/* Export options */}
                                    <div className="flex flex-col gap-[10px]">
                                        {EXPORT_OPTIONS_T.map((option, idx) => {
                                            const Icon = option.icon;
                                            const isSelected = selectedAction === option.id;
                                            const isConfirming = confirmingAction === option.id;

                                            return (
                                                <motion.button
                                                    key={option.id}
                                                    onClick={() => !selectedAction && handleExportClick(option.id)}
                                                    disabled={!!selectedAction && !isSelected}
                                                    className="relative flex items-center gap-4 w-full rounded-[14px] p-4 cursor-pointer text-left transition-all duration-200 group"
                                                    style={{
                                                        backgroundColor: isSelected
                                                            ? `${config.accent}18`
                                                            : "rgba(255,255,255,0.03)",
                                                        border: `1px solid ${isSelected ? `${config.accent}50` : "rgba(255,255,255,0.06)"}`,
                                                        opacity: selectedAction && !isSelected ? 0.35 : 1,
                                                    }}
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: selectedAction && !isSelected ? 0.35 : 1, y: 0 }}
                                                    transition={{
                                                        delay: idx * 0.04,
                                                        duration: 0.35,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    }}
                                                    whileHover={!selectedAction ? {
                                                        backgroundColor: `${config.accent}12`,
                                                        borderColor: `${config.accent}35`,
                                                    } : undefined}
                                                    whileTap={!selectedAction ? { scale: 0.98 } : undefined}
                                                >
                                                    {/* Icon container */}
                                                    <div
                                                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-colors duration-200"
                                                        style={{
                                                            backgroundColor: isSelected
                                                                ? `${config.accent}30`
                                                                : `${config.accent}10`,
                                                        }}
                                                    >
                                                        <AnimatePresence mode="wait">
                                                            {isConfirming ? (
                                                                <motion.div
                                                                    key="check"
                                                                    initial={{ scale: 0, rotate: -90 }}
                                                                    animate={{ scale: 1, rotate: 0 }}
                                                                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                                                >
                                                                    <CheckCircle2
                                                                        className="w-5 h-5"
                                                                        style={{ color: config.accent }}
                                                                    />
                                                                </motion.div>
                                                            ) : (
                                                                <motion.div
                                                                    key="icon"
                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                >
                                                                    <Icon
                                                                        className="w-5 h-5"
                                                                        style={{ color: config.accent }}
                                                                    />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Text */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-manrope font-medium text-[14px] text-white">
                                                            {isConfirming ? t("share.preparing") : option.label}
                                                        </p>
                                                        <p className="font-manrope font-normal text-[12px] text-white/40 truncate">
                                                            {isConfirming ? t("share.oneSecond") : option.description}
                                                        </p>
                                                    </div>

                                                    {/* Chevron / status */}
                                                    <div className="shrink-0">
                                                        {isConfirming ? (
                                                            <motion.div
                                                                className="w-5 h-5"
                                                                animate={{ rotate: 360 }}
                                                                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke={config.accent} strokeWidth="2.5" />
                                                                    <path className="opacity-80" fill={config.accent} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                </svg>
                                                            </motion.div>
                                                        ) : (
                                                            <ChevronRight
                                                                className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors"
                                                            />
                                                        )}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {/* Footer hint */}
                                    <p className="font-manrope font-normal text-[11px] text-white/25 text-center pt-1">
                                        {t("share.swipeToClose")}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}