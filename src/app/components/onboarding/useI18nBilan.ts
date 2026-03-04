/**
 * ============================================================================
 * useI18nBilan — Shared i18n hook for all Bilan/Niveau content blocks
 * ============================================================================
 * 
 * Provides translated versions of:
 * - Period tab labels (Semaine/Mois/Trimestre)
 * - Period range labels (7 derniers jours / Last 7 days)
 * - Date range generator with translated month abbreviations
 * - Common block titles (Tableau de bord, Activité, etc.)
 * 
 * @usage const { t, periodLabels, periodTabs, getDateRange } = useI18nBilan();
 */

import { useMemo } from "react";
import { useTranslation } from "../language-provider";
import { CalendarDays, Calendar, CalendarRange } from "lucide-react";

type BilanPeriod = 'semaine' | 'mois' | 'trimestre';

const MONTH_KEYS = [
    "month.jan", "month.feb", "month.mar", "month.apr",
    "month.may", "month.jun", "month.jul", "month.aug",
    "month.sep", "month.oct", "month.nov", "month.dec"
];

const PERIOD_LABEL_KEYS: Record<BilanPeriod, string> = {
    semaine: "period.last7days",
    mois: "period.last30days",
    trimestre: "period.last90days"
};

const PERIOD_TAB_KEYS: Record<BilanPeriod, string> = {
    semaine: "period.week",
    mois: "period.month",
    trimestre: "period.quarter"
};

export function useI18nBilan() {
    const { t, language } = useTranslation();

    const periodLabels = useMemo(() => ({
        semaine: t("period.last7days"),
        mois: t("period.last30days"),
        trimestre: t("period.last90days")
    } as Record<BilanPeriod, string>), [language]);

    const periodTabs = useMemo(() => [
        { id: "semaine" as BilanPeriod, label: t("period.week"), icon: CalendarDays },
        { id: "mois" as BilanPeriod, label: t("period.month"), icon: Calendar },
        { id: "trimestre" as BilanPeriod, label: t("period.quarter"), icon: CalendarRange }
    ], [language]);

    const getDateRange = useMemo(() => (period: BilanPeriod): string => {
        const today = new Date();
        const past = new Date(today);
        const months = MONTH_KEYS.map(k => t(k));

        if (period === 'semaine') past.setDate(today.getDate() - 7);
        else if (period === 'mois') past.setDate(today.getDate() - 30);
        else past.setDate(today.getDate() - 90);

        return `${past.getDate()} ${months[past.getMonth()]} - ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    }, [language]);

    return { t, language, periodLabels, periodTabs, getDateRange };
}
