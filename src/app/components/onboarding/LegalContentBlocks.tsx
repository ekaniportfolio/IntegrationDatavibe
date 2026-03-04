/**
 * ============================================================================
 * LEGAL CONTENT BLOCKS — Page "Légal"
 * ============================================================================
 *
 * Autonomous overlay page (same pattern as ConnexionsContentBlocks / OffreContentBlocks):
 * 1. Title block ("Légal" + subtitle)
 * 2. Document navigation tabs (CGU, CGV, Confidentialité, PI, Cookies, Mentions)
 * 3. Accordion articles within each document
 *
 * This page does NOT use TAF tabs (Streaming/Réseaux/Médias).
 * This page does NOT have a BilanBottomNav.
 * Lateral Spatial Flow is handled by the parent AnimatePresence wrapper
 * in NewPlatform.tsx.
 *
 * MECHANICS:
 * - Nonchalant Cascade entrance/exit (same system as Connexions/Offre)
 * - Document tabs with layoutId pill transmigration
 * - Expandable accordion articles with spring animations
 * - Sticky bottom document nav (portaled to body, same as Offre)
 *   with TAF soul label transmigration between inline tabs and sticky nav
 * - Spatial Flow lateral between document changes
 * - "Last updated" badges with subtle glow
 * - Article content with typographic hierarchy
 *
 * @backend GET /api/v1/config/legal/full
 * ============================================================================
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
    FileText, Receipt, Shield, Copyright, Cookie, Building2,
    ChevronDown, Scale, Calendar, Mail, ExternalLink
} from "lucide-react";
import {
    MOCK_LEGAL_DOCUMENTS,
    MOCK_LEGAL_ENTITY,
    type LegalDocumentId,
    type LegalDocument,
    type LegalArticle,
} from "../../data/mock-backend";
import { useTranslation } from "../language-provider";

/* ═══════════════════════════════════════════════════════════════════════════
 * NONCHALANT CASCADE — Same system as ConnexionsContentBlocks / OffreContentBlocks
 * ═══════════════════════════════════════════════════════════════════════════ */
const REGAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CASCADE_Y = 28;
const CASCADE_BLUR = 6;
const CASCADE_DURATION = 0.7;

const EXIT_DURATION = 0.28;
const EXIT_Y = 24;
const EXIT_BLUR = 5;
const EXIT_SPREAD = 0.18;
const MAX_ENTRANCE_DELAY = 0.72;

const exitDelay = (entranceDelay: number) =>
    Math.max(0, ((MAX_ENTRANCE_DELAY - entranceDelay) / MAX_ENTRANCE_DELAY) * EXIT_SPREAD);

const cascade = (delay: number) => ({
    initial: { opacity: 0, y: CASCADE_Y, filter: `blur(${CASCADE_BLUR}px)` },
    animate: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: CASCADE_DURATION, ease: REGAL_EASE, delay }
    },
    exit: {
        opacity: 0, y: EXIT_Y, filter: `blur(${EXIT_BLUR}px)`,
        transition: { duration: EXIT_DURATION, ease: REGAL_EASE, delay: exitDelay(delay) }
    },
});

/* ─── Document icon mapping ─── */
const DOC_ICONS: Record<LegalDocumentId, typeof FileText> = {
    cgu: FileText,
    cgv: Receipt,
    privacy: Shield,
    ip: Copyright,
    cookies: Cookie,
    mentions: Building2,
};

/* ─── Document tab labels (short) ─── */
const DOC_SHORT_LABELS: Record<LegalDocumentId, string> = {
    cgu: 'CGU',
    cgv: 'CGV',
    privacy: 'Confidentialité',
    ip: 'Propriété Int.',
    cookies: 'Cookies',
    mentions: 'Mentions',
};

/* ─── Document nav colors ─── */
const DOC_NAV_COLORS: Record<LegalDocumentId, string> = {
    cgu: '#7038FF',
    cgv: '#9B6DFF',
    privacy: '#4ade80',
    ip: '#f59e0b',
    cookies: '#f472b6',
    mentions: '#60a5fa',
};

const DOC_ORDER: LegalDocumentId[] = ['cgu', 'cgv', 'privacy', 'ip', 'cookies', 'mentions'];

/* ─── Format date helper ─── */
function formatDate(isoDate: string, lang: string = 'fr'): string {
    const d = new Date(isoDate);
    const locale = lang === 'en' ? 'en-US' : 'fr-FR';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ═══════════════════════════════════════════════════════════════════════════
 * ACCORDION ARTICLE — Expandable legal article
 * ═══════════════════════════════════════════════════════════════════════════ */
function AccordionArticle({
    article,
    isOpen,
    onToggle,
    cascadeDelay,
    articleIndex,
}: {
    article: LegalArticle;
    isOpen: boolean;
    onToggle: () => void;
    cascadeDelay: number;
    articleIndex: number;
}) {
    return (
        <motion.div
            className="w-full rounded-[14px] overflow-hidden"
            style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: `1px solid ${isOpen ? 'rgba(112,56,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
            }}
            {...cascade(cascadeDelay)}
            layout
            transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
                ...cascade(cascadeDelay).animate?.transition,
            }}
        >
            {/* Header — always visible */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer group transition-colors duration-200 hover:bg-foreground/[0.02]"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                        className="w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 transition-colors duration-200"
                        style={{
                            backgroundColor: isOpen ? "rgba(112,56,255,0.15)" : "rgba(0,0,0,0.04)",
                        }}
                    >
                        <span
                            className="font-manrope font-bold text-[10px] transition-colors duration-200"
                            style={{ color: isOpen ? "#7038FF" : "var(--muted-foreground)" }}
                        >
                            {articleIndex + 1}
                        </span>
                    </div>
                    <span
                        className="font-manrope font-medium text-[13px] text-left leading-tight transition-colors duration-200"
                        style={{ color: isOpen ? "var(--foreground)" : "var(--muted-foreground)" }}
                    >
                        {article.title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="shrink-0 ml-2"
                >
                    <ChevronDown
                        className="w-4 h-4 transition-colors duration-200"
                        style={{ color: isOpen ? "#7038FF" : "var(--muted-foreground)" }}
                    />
                </motion.div>
            </button>

            {/* Content — expandable */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                                height: { type: "spring", stiffness: 200, damping: 28 },
                                opacity: { duration: 0.3, delay: 0.1 },
                            }
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: { type: "spring", stiffness: 250, damping: 30 },
                                opacity: { duration: 0.15 },
                            }
                        }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0">
                            {/* Separator */}
                            <div
                                className="h-px w-full mb-3"
                                style={{
                                    background: "linear-gradient(to right, transparent, rgba(112,56,255,0.2), transparent)"
                                }}
                            />
                            {/* Content paragraphs */}
                            <div className="flex flex-col gap-3">
                                {article.content.split('\n\n').map((paragraph, pIdx) => (
                                    <p
                                        key={pIdx}
                                        className="font-manrope font-normal text-[12.5px] text-muted-foreground leading-[1.7] whitespace-pre-wrap"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * DOCUMENT TABS — Scrollable tab row (inline)
 * ═══════════════════════════════════════════════════════════════════════════ */
function DocTabs({
    activeDoc,
    onDocChange,
    enableSoulLabels = false,
}: {
    activeDoc: LegalDocumentId;
    onDocChange: (id: LegalDocumentId) => void;
    enableSoulLabels?: boolean;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll active tab into center — pure scrollLeft to avoid Y-axis shifts
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const activeBtn = container.querySelector(`[data-doc="${activeDoc}"]`) as HTMLElement;
        if (!activeBtn) return;
        const containerWidth = container.offsetWidth;
        const btnLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        const targetScroll = btnLeft - (containerWidth / 2) + (btnWidth / 2);
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }, [activeDoc]);

    return (
        <motion.div
            ref={scrollRef}
            className="flex w-full overflow-x-auto no-scrollbar gap-[6px] pb-1 items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overscrollBehaviorX: 'contain', minHeight: 36 }}
            {...cascade(0.08)}
        >
            {DOC_ORDER.map((docId) => {
                const isActive = docId === activeDoc;
                const DocIcon = DOC_ICONS[docId];
                const color = DOC_NAV_COLORS[docId];

                return (
                    <button
                        key={docId}
                        data-doc={docId}
                        onClick={() => onDocChange(docId)}
                        className="relative flex items-center gap-1.5 py-[7px] px-[10px] rounded-[10px] font-manrope font-medium text-[11px] transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0"
                        style={{
                            color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                        }}
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-[10px]"
                                style={{
                                    backgroundColor: `${color}18`,
                                    border: `1px solid ${color}35`,
                                }}
                                layoutId="legal-doc-pill"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <DocIcon
                            className="relative z-10 w-3.5 h-3.5 transition-colors duration-200"
                            style={{ color: isActive ? color : "var(--muted-foreground)" }}
                        />
                        {enableSoulLabels ? (
                            <motion.span
                                className="relative z-10"
                                layoutId={`legal-soul-${docId}`}
                                transition={{ type: "spring", stiffness: 105, damping: 18, mass: 1 }}
                                style={{ display: 'inline-block' }}
                            >
                                {DOC_SHORT_LABELS[docId]}
                            </motion.span>
                        ) : (
                            <span className="relative z-10">{DOC_SHORT_LABELS[docId]}</span>
                        )}
                    </button>
                );
            })}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ═══════════════════════════════════════════════════════════════════════════ */
export function LegalContentBlocks() {
    const { t, language } = useTranslation();
    const [activeDoc, setActiveDoc] = useState<LegalDocumentId>('cgu');
    const [openArticles, setOpenArticles] = useState<Set<string>>(new Set());
    const [docDirection, setDocDirection] = useState(0);
    const [showStickyNav, setShowStickyNav] = useState(false);
    const prevDocRef = useRef(activeDoc);
    const inlineTabsRef = useRef<HTMLDivElement>(null);
    const stickyNavScrollRef = useRef<HTMLDivElement>(null);

    const activeDocument = MOCK_LEGAL_DOCUMENTS.find(d => d.id === activeDoc)!;
    const activeColor = DOC_NAV_COLORS[activeDoc];

    /* ── Auto-scroll sticky nav to center active tab ── */
    useEffect(() => {
        const container = stickyNavScrollRef.current;
        if (!container || !showStickyNav) return;
        const activeBtn = container.querySelector(`[data-sticky-doc="${activeDoc}"]`) as HTMLElement;
        if (!activeBtn) return;
        const containerWidth = container.offsetWidth;
        const btnLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        const targetScroll = btnLeft - (containerWidth / 2) + (btnWidth / 2);
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }, [activeDoc, showStickyNav]);

    /* ── IntersectionObserver: show sticky nav when inline tabs scroll out ── */
    useEffect(() => {
        const el = inlineTabsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyNav(!entry.isIntersecting);
            },
            { threshold: 0, rootMargin: '-20px 0px 0px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleDocChange = useCallback((docId: LegalDocumentId) => {
        const prevIdx = DOC_ORDER.indexOf(prevDocRef.current);
        const nextIdx = DOC_ORDER.indexOf(docId);
        setDocDirection(nextIdx > prevIdx ? 1 : -1);
        prevDocRef.current = docId;
        setActiveDoc(docId);
        setOpenArticles(new Set()); // Reset expanded articles on doc change
    }, []);

    const handleStickyDocChange = useCallback((docId: LegalDocumentId) => {
        const prevIdx = DOC_ORDER.indexOf(prevDocRef.current);
        const nextIdx = DOC_ORDER.indexOf(docId);
        setDocDirection(nextIdx > prevIdx ? 1 : -1);
        prevDocRef.current = docId;
        setActiveDoc(docId);
        setOpenArticles(new Set());
        // Scroll to top — same pattern as BilanBottomNav
        const scrollContainer = document.getElementById('main-scroll-container');
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (scrollContainer) scrollContainer.scrollTop = 0;
    }, []);

    const toggleArticle = useCallback((articleId: string) => {
        setOpenArticles(prev => {
            const next = new Set(prev);
            if (next.has(articleId)) {
                next.delete(articleId);
            } else {
                next.add(articleId);
            }
            return next;
        });
    }, []);

    const expandAll = useCallback(() => {
        setOpenArticles(new Set(activeDocument.articles.map(a => a.id)));
    }, [activeDocument]);

    const collapseAll = useCallback(() => {
        setOpenArticles(new Set());
    }, []);

    const allExpanded = activeDocument.articles.every(a => openArticles.has(a.id));

    return (
        <LayoutGroup>
            {/* T0: Title */}
            <motion.div className="flex flex-col gap-[2px] px-1 w-full relative items-center" {...cascade(0)}>
                <motion.div className="flex items-center gap-2.5 justify-center" {...cascade(0)}>
                    <div
                        className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                        style={{ backgroundColor: "rgba(112,56,255,0.12)", border: "1px solid rgba(112,56,255,0.2)" }}
                    >
                        <Scale className="w-4 h-4 text-[#7038FF]" />
                    </div>
                    <h2 className="font-manrope font-bold text-[22px] text-foreground text-center leading-tight">
                        {t("legal.title")}
                    </h2>
                </motion.div>
                <motion.p className="font-manrope font-normal text-[14px] text-center text-muted-foreground leading-tight" {...cascade(0.04)}>
                    {t("legal.subtitle")}
                </motion.p>
            </motion.div>

            {/* T1: Inline Document Tabs — observed for sticky trigger */}
            <div ref={inlineTabsRef} className="w-full">
                {!showStickyNav ? (
                    <DocTabs
                        activeDoc={activeDoc}
                        onDocChange={handleDocChange}
                        enableSoulLabels={true}
                    />
                ) : (
                    /* Ghost placeholder */
                    <div className="flex w-full overflow-x-auto no-scrollbar gap-[6px] pb-1" style={{ scrollbarWidth: 'none' }}>
                        {DOC_ORDER.map((docId) => {
                            const isActive = docId === activeDoc;
                            const DocIcon = DOC_ICONS[docId];
                            const color = DOC_NAV_COLORS[docId];
                            return (
                                <button
                                    key={docId}
                                    onClick={() => handleDocChange(docId)}
                                    className="relative flex items-center gap-1.5 py-[7px] px-[10px] rounded-[10px] font-manrope font-medium text-[11px] cursor-pointer whitespace-nowrap shrink-0"
                                    style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
                                >
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-[10px]"
                                            style={{ backgroundColor: `${color}18`, border: `1px solid ${color}35` }}
                                            layoutId="legal-doc-pill"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <DocIcon
                                        className="relative z-10 w-3.5 h-3.5"
                                        style={{ color: isActive ? color : "var(--muted-foreground)" }}
                                    />
                                    <span className="relative z-10 opacity-0">{DOC_SHORT_LABELS[docId]}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* T2: Document header card */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={activeDoc}
                    className="w-full"
                    initial={{ opacity: 0, x: docDirection * 60, filter: `blur(${CASCADE_BLUR}px)` }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: REGAL_EASE } }}
                    exit={{ opacity: 0, x: docDirection * -60, filter: `blur(${EXIT_BLUR}px)`, transition: { duration: 0.25, ease: REGAL_EASE } }}
                >
                    {/* Document meta card */}
                    <motion.div
                        className="w-full rounded-[16px] p-4 flex flex-col gap-3"
                        style={{
                            background: `linear-gradient(135deg, ${activeColor}0A 0%, ${activeColor}04 100%)`,
                            border: `1px solid ${activeColor}20`,
                        }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-manrope font-bold text-[15px] text-foreground leading-tight">
                                    {activeDocument.title}
                                </h3>
                                <p className="font-manrope font-normal text-[12px] text-muted-foreground/60 leading-tight mt-1">
                                    {activeDocument.subtitle}
                                </p>
                            </div>
                            {(() => {
                                const DocIcon = DOC_ICONS[activeDoc];
                                return (
                                    <div
                                        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ml-3"
                                        style={{ backgroundColor: `${activeColor}15` }}
                                    >
                                        <DocIcon className="w-5 h-5" style={{ color: activeColor }} />
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Meta row: date + article count + expand/collapse */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 text-muted-foreground/40" />
                                    <span className="font-manrope font-normal text-[11px] text-muted-foreground/50">
                                        {t("legal.lastUpdated")} {formatDate(activeDocument.lastUpdated, language)}
                                    </span>
                                </div>
                                <div
                                    className="px-2 py-0.5 rounded-full font-manrope font-medium text-[10px]"
                                    style={{
                                        backgroundColor: `${activeColor}15`,
                                        color: activeColor,
                                    }}
                                >
                                    {activeDocument.articles.length} article{activeDocument.articles.length > 1 ? 's' : ''}
                                </div>
                            </div>
                            <button
                                onClick={allExpanded ? collapseAll : expandAll}
                                className="font-manrope font-medium text-[11px] cursor-pointer transition-colors duration-200"
                                style={{ color: `${activeColor}90` }}
                            >
                                {allExpanded ? t('legal.collapseAll') : t('legal.expandAll')}
                            </button>
                        </div>
                    </motion.div>

                    {/* T3: Articles accordion */}
                    <div className="flex flex-col gap-2 w-full mt-4">
                        {activeDocument.articles.map((article, idx) => (
                            <AccordionArticle
                                key={article.id}
                                article={article}
                                isOpen={openArticles.has(article.id)}
                                onToggle={() => toggleArticle(article.id)}
                                cascadeDelay={0.22 + idx * 0.06}
                                articleIndex={idx}
                            />
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* T4: Legal entity footer */}
            <motion.div
                className="w-full rounded-[14px] p-4 flex flex-col gap-3 items-center bg-foreground/[0.02] border border-foreground/[0.05]"
                {...cascade(0.55)}
            >
                <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground/35" />
                    <span className="font-manrope font-bold text-[12px] text-muted-foreground/60">
                        {MOCK_LEGAL_ENTITY.companyName}
                    </span>
                </div>
                <p className="font-manrope font-normal text-[11px] text-muted-foreground/35 text-center">
                    SIRET : {MOCK_LEGAL_ENTITY.siret}
                </p>
                <p className="font-manrope font-normal text-[11px] text-muted-foreground/35 text-center">
                    {MOCK_LEGAL_ENTITY.countryFr}
                </p>

                {/* Contact links */}
                <div className="flex items-center gap-4 mt-1">
                    <a
                        href="mailto:legal@datavibe.app"
                        className="flex items-center gap-1.5 font-manrope font-medium text-[11px] text-[#7038FF]/60 hover:text-[#7038FF] transition-colors duration-200"
                    >
                        <Mail className="w-3 h-3" />
                        legal@datavibe.app
                    </a>
                    <a
                        href="mailto:dpo@datavibe.app"
                        className="flex items-center gap-1.5 font-manrope font-medium text-[11px] text-[#4ade80]/60 hover:text-[#4ade80] transition-colors duration-200"
                    >
                        <Shield className="w-3 h-3" />
                        DPO
                    </a>
                </div>
            </motion.div>

            {/* T5: Bottom note */}
            <motion.p
                className="font-manrope font-normal text-[11px] text-muted-foreground/25 text-center px-4 pb-6"
                {...cascade(0.62)}
            >
                {t("legal.legalNote")}
            </motion.p>

            {/* ═══ Sticky Bottom Doc Nav — Portaled to document.body ═══ */}
            {createPortal(
                <AnimatePresence>
                    {showStickyNav && (
                        <motion.div
                            key="navbar-legal-sticky"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0, transition: { type: "spring", stiffness: 82, damping: 24, mass: 1 } }}
                            transition={{ type: "spring", stiffness: 82, damping: 24, mass: 1 }}
                            className="fixed bottom-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-md border-t border-border pb-12 pt-3 px-2 flex items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                            style={{ willChange: "transform" }}
                        >
                            <div ref={stickyNavScrollRef} className="flex w-full overflow-x-auto no-scrollbar items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overscrollBehaviorX: 'contain' }}>
                                {DOC_ORDER.map((docId) => {
                                    const DocIcon = DOC_ICONS[docId];
                                    const isActive = activeDoc === docId;
                                    const color = DOC_NAV_COLORS[docId];

                                    return (
                                        <div
                                            key={docId}
                                            data-sticky-doc={docId}
                                            onClick={() => handleStickyDocChange(docId)}
                                            className="shrink-0 flex flex-col items-center gap-1 cursor-pointer relative group transition-all duration-300 px-3"
                                            style={{ minWidth: 56 }}
                                        >
                                            {/* Glow */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="legal-bottom-nav-glow"
                                                    className="absolute -inset-3 blur-xl rounded-full"
                                                    style={{ backgroundColor: `${color}20` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}

                                            {/* Icon */}
                                            <DocIcon
                                                className="relative z-10 w-5 h-5 transition-all duration-300"
                                                style={{
                                                    color: isActive ? color : "var(--muted-foreground)",
                                                    opacity: isActive ? 1 : 0.4,
                                                    strokeWidth: isActive ? 2.5 : 2
                                                }}
                                            />

                                            {/* Soul Label */}
                                            <div className="h-[18px] flex items-center justify-center relative overflow-visible">
                                                <motion.span
                                                    layoutId={`legal-soul-${docId}`}
                                                    className="text-[10px] font-bold font-manrope whitespace-nowrap"
                                                    style={{
                                                        color: isActive ? color : "var(--muted-foreground)",
                                                        zIndex: 9999,
                                                    }}
                                                    animate={{
                                                        opacity: isActive ? 1 : 0.3,
                                                    }}
                                                    exit={{ opacity: 1, transition: { duration: 0 } }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 105,
                                                        damping: 18,
                                                        mass: 1,
                                                    }}
                                                >
                                                    {DOC_SHORT_LABELS[docId]}
                                                </motion.span>
                                            </div>

                                            {/* Active dot */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="legal-active-dot"
                                                    className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </LayoutGroup>
    );
}