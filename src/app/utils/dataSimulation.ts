import { ReflexOpportunityData, ReflexOpportunityPage } from "../reflex-matrix/ReflexOpportunity";
import { format, subDays, addDays } from "date-fns";
import { fr, enUS } from "date-fns/locale";

// --- THUMBNAIL IMAGE POOLS (randomized at each startup) ---
const STREAMING_THUMBNAIL_POOL = [
    "https://images.unsplash.com/photo-1680466457036-30e400aeabab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMGJlY29yZGluZyUyMGFydGlzdHxlbnwxfHx8fDE3NzIwNTIxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1559799536-95e03ae1db1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwcGxheWxpc3QlMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc3MjA4NDc4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1767474833645-0465485ca6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y2VyJTIwbWl4aW5nJTIwY29uc29sZXxlbnwxfHx8fDE3NzIwODQ3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1701374929875-37125c54cb29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMHR1cm50YWJsZXxlbnwxfHx8fDE3NzE5OTkzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1763598375681-93a2c8b24579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGVsZWN0cm9uaWMlMjBtdXNpYyUyMHR1cm50YWJsZXxlbnwxfHx8fDE3NzIwODQ3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1645622267303-7813903392bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlib2FyZCUyMHBpYW5vJTIwbXVzaWNpYW4lMjBoYW5kc3xlbnwxfHx8fDE3NzIwODQ3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1724185773486-0b39642e607e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMHdhdmVzJTIwYXVkaW8lMjBlcXVhbGl6ZXJ8ZW58MXx8fHwxNzcyMDg0NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1771616504939-1187e5b82226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBhY291c3RpYyUyMG11c2ljaWFuJTIwcGxheWluZ3xlbnwxfHx8fDE3NzIwODQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwcGxheWxpc3QlMjBtdXNpYyUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzAxNzIwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzcwMTgyMTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwc3R1ZGlvfGVufDF8fHx8MTc3MDE4MjE0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

const SOCIAL_THUMBNAIL_POOL = [
    "https://images.unsplash.com/photo-1620396748669-46bd3128ccce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWt0b2slMjBjcmVhdG9yJTIwc21hcnRwaG9uZSUyMGZpbG1pbmd8ZW58MXx8fHwxNzcyMDg0Nzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1645848977702-69fa784ea954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGluZmx1ZW5jZXIlMjBjb250ZW50fGVufDF8fHx8MTc3MjA0NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1587984584042-dcc9ba27e054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBzdG9yeSUyMHBob25lJTIwc2NyZWVufGVufDF8fHx8MTc3MjA3NTcwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1764664035187-e89b27d54c7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0dWJlJTIwdmlkZW8lMjBjcmVhdG9yJTIwc2V0dXB8ZW58MXx8fHwxNzcyMDg0Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1613816263208-b1c248ac3a2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBmYW5zJTIwZ3JvdXAlMjBjaGVlcmluZ3xlbnwxfHx8fDE3NzIwODQ3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1763136469661-5bed49c5a9a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3JkJTIwZ2FtZXIlMjBjb21tdW5pdHklMjBjb21wdXRlcnxlbnwxfHx8fDE3NzA5MDQ2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1700004058857-a16820600be0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWt0b2slMjBpbmZsdWVuY2VyJTIwdmlyYWwlMjB2aWRlbyUyMGNyZWF0b3J8ZW58MXx8fHwxNzcwMTY5NjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjByZWVsc3xlbnwxfHx8fDE3NzA5MDQ2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YWdyYW0lMjBjb250ZW50JTIwY3JlYXRvciUyMHN0dWRpb3xlbnwxfHx8fDE3NzA5MDQ2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

const RADIO_THUMBNAIL_POOL = [
    "https://images.unsplash.com/photo-1713281318623-eb73e86e23c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMHN0YXRpb24lMjBicm9hZGNhc3QlMjBtaWNyb3Bob25lfGVufDF8fHx8MTc3MjA4NDc4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1660675588067-13ecd2c19de4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwaW50ZXJ2aWV3JTIwcmVjb3JkaW5nJTIwc3R1ZGlvfGVufDF8fHx8MTc3MjA4NDc4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1557804506-e969d7b32a4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXN0JTIwbWVkaWElMjBwcmVzcyUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzcyMDg0NzkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1674124504779-62197c204390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHZpZGVvJTIwYmVoaW5kJTIwc2NlbmVzJTIwY2FtZXJhfGVufDF8fHx8MTc3MjA4NDc5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1562670905-3eff96f2d24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHpvdXJuYWxpc3QlMjBpbnRlcnZpZXclMjB3cml0aW5nfGVufDF8fHx8MTc3MDkwNDY0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lfGVufDF8fHx8MTc3MDkwNDY0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1767474365536-ef81bfa24c8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMHN0YXRpb24lMjBtaWNyb3Bob25lJTIwaW50ZXJ2aWV3fGVufDF8fHx8MTc3MDkwNDY0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1660808059821-cd1abacc2371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWRpbyUyMHN0dWRpbyUyMG1pY3JvcGhvbmUlMjBpbnRlcnZpZXclMjBtdXNpY3xlbnwxfHx8fDE3NzAxNjk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

// Shared pool for social proof (performance / concert / artist images)
const SOCIAL_PROOF_THUMBNAIL_POOL = [
    "https://images.unsplash.com/photo-1658046413536-6e5933dfd939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjBjcm93ZHxlbnwxfHx8fDE3NzE5OTM1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1704253802932-61137bd11d07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjBtaWNyb3Bob25lJTIwcGVyZm9ybWFuY2UlMjBsaXZlfGVufDF8fHx8MTc3MjA4NDc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1760965824369-1a867927c1e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwYXVkaWVuY2UlMjBuaWdodHxlbnwxfHx8fDE3NzIwODQ3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1766650577007-e4b9d23af1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjByYXBwZXIlMjB1cmJhbiUyMHN0cmVldHxlbnwxfHx8fDE3NzIwODQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1770134706436-415a996d540f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5kJTIwcmVoZWFyc2FsJTIwaW5zdHJ1bWVudHMlMjBkcnVtc3xlbnwxfHx8fDE3NzIwODQ3OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1596131397999-bb01560efcae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwbXVzaWMlMjBjbHVifGVufDF8fHx8MTc3MjA4NDc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1731419741064-be6cbe9fa2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGdvc3BlbCUyMHNpbmdlciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MDE4MjAwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1516280440614-6697288d5d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2R8ZW58MXx8fHwxNzcwMTgyMTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxka3xlbnwxfHx8fDE3NzAxODIxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpb3xlbnwxfHx8fDE3NzA5MDQ2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

/** Pick a random element from an array without repeating within a session batch */
function shufflePool<T>(pool: T[]): T[] {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/** Pick N unique random images from a pool (Fisher-Yates partial shuffle) */
function pickUniqueFromPool(pool: string[], count: number): string[] {
    const shuffled = shufflePool(pool);
    return shuffled.slice(0, count);
}

/** Helper: simple template interpolation for translation strings with {placeholders} */
function interpolate(template: string, vars: Record<string, string | number>): string {
    return Object.entries(vars).reduce(
        (str, [key, val]) => str.replace(new RegExp(`\{${key}\}`, 'g'), String(val)),
        template
    );
}

/** Get date-fns locale from language code */
function getDateLocale(lang: string) {
    return lang === 'en' ? enUS : fr;
}

function buildStreamingPages(t: (key: string) => string): ReflexOpportunityPage[] {
    return [
        {
            playlist: {
                title: t("reflex.page1.playlistTitle"),
                description: t("reflex.page1.playlistDesc"),
                videoSrc: pickUniqueFromPool(STREAMING_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.page1.insightTitle"),
            insightText: t("reflex.page1.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.page1.socialTitle"),
                author: "Leto",
                views: t("reflex.page1.socialViews"),
                initials: "L",
                descriptionTitle: t("reflex.page1.socialDescTitle"),
                description: t("reflex.page1.socialDesc")
            },
            badgeType: 'priorite' as const
        },
        {
            playlist: {
                title: t("reflex.page2.playlistTitle"),
                description: t("reflex.page2.playlistDesc"),
                videoSrc: pickUniqueFromPool(STREAMING_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.page2.insightTitle"),
            insightText: t("reflex.page2.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.page2.socialTitle"),
                author: "Sarah M.",
                views: t("reflex.page2.socialViews"),
                initials: "S",
                descriptionTitle: t("reflex.page2.socialDescTitle"),
                description: t("reflex.page2.socialDesc")
            },
            badgeType: 'recommande' as const
        },
        {
            playlist: {
                title: t("reflex.page3.playlistTitle"),
                description: t("reflex.page3.playlistDesc"),
                videoSrc: pickUniqueFromPool(STREAMING_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.page3.insightTitle"),
            insightText: t("reflex.page3.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.page3.socialTitle"),
                author: "DJ K.",
                views: t("reflex.page3.socialViews"),
                initials: "D",
                descriptionTitle: t("reflex.page3.socialDescTitle"),
                description: t("reflex.page3.socialDesc")
            },
            badgeType: 'bonus' as const
        }
    ];
}

function buildSocialPages(t: (key: string) => string): ReflexOpportunityPage[] {
    return [
        {
            playlist: {
                title: t("reflex.social.page1.playlistTitle"),
                description: t("reflex.social.page1.playlistDesc"),
                videoSrc: pickUniqueFromPool(SOCIAL_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.social.page1.insightTitle"),
            insightText: t("reflex.social.page1.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.social.page1.socialTitle"),
                author: "Tiktokeuse X",
                views: t("reflex.social.page1.socialViews"),
                initials: "T",
                descriptionTitle: t("reflex.social.page1.socialDescTitle"),
                description: t("reflex.social.page1.socialDesc")
            },
            badgeType: 'priorite' as const
        },
        {
            playlist: {
                title: t("reflex.social.page2.playlistTitle"),
                description: t("reflex.social.page2.playlistDesc"),
                videoSrc: pickUniqueFromPool(SOCIAL_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.social.page2.insightTitle"),
            insightText: t("reflex.social.page2.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.social.page2.socialTitle"),
                author: "Indie Pop",
                views: t("reflex.social.page2.socialViews"),
                initials: "I",
                descriptionTitle: t("reflex.social.page2.socialDescTitle"),
                description: t("reflex.social.page2.socialDesc")
            },
            badgeType: 'recommande' as const
        },
        {
            playlist: {
                title: t("reflex.social.page3.playlistTitle"),
                description: t("reflex.social.page3.playlistDesc"),
                videoSrc: pickUniqueFromPool(SOCIAL_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.social.page3.insightTitle"),
            insightText: t("reflex.social.page3.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.social.page3.socialTitle"),
                author: "Rapper Y",
                views: t("reflex.social.page3.socialViews"),
                initials: "R",
                descriptionTitle: t("reflex.social.page3.socialDescTitle"),
                description: t("reflex.social.page3.socialDesc")
            },
            badgeType: 'bonus' as const
        }
    ];
}

function buildRadioPages(t: (key: string) => string): ReflexOpportunityPage[] {
    return [
        {
            playlist: {
                title: t("reflex.radio.page1.playlistTitle"),
                description: t("reflex.radio.page1.playlistDesc"),
                videoSrc: pickUniqueFromPool(RADIO_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.radio.page1.insightTitle"),
            insightText: t("reflex.radio.page1.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.radio.page1.socialTitle"),
                author: "Manager Z",
                views: t("reflex.radio.page1.socialViews"),
                initials: "M",
                descriptionTitle: t("reflex.radio.page1.socialDescTitle"),
                description: t("reflex.radio.page1.socialDesc")
            },
            badgeType: 'priorite' as const
        },
        {
            playlist: {
                title: t("reflex.radio.page2.playlistTitle"),
                description: t("reflex.radio.page2.playlistDesc"),
                videoSrc: pickUniqueFromPool(RADIO_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.radio.page2.insightTitle"),
            insightText: t("reflex.radio.page2.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.radio.page2.socialTitle"),
                author: "Artist A",
                views: t("reflex.radio.page2.socialViews"),
                initials: "A",
                descriptionTitle: t("reflex.radio.page2.socialDescTitle"),
                description: t("reflex.radio.page2.socialDesc")
            },
            badgeType: 'recommande' as const
        },
        {
            playlist: {
                title: t("reflex.radio.page3.playlistTitle"),
                description: t("reflex.radio.page3.playlistDesc"),
                videoSrc: pickUniqueFromPool(RADIO_THUMBNAIL_POOL, 1)[0]
            },
            insightTitle: t("reflex.radio.page3.insightTitle"),
            insightText: t("reflex.radio.page3.insightText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.radio.page3.socialTitle"),
                author: "Indie Rock",
                views: t("reflex.radio.page3.socialViews"),
                initials: "I",
                descriptionTitle: t("reflex.radio.page3.socialDescTitle"),
                description: t("reflex.radio.page3.socialDesc")
            },
            badgeType: 'bonus' as const
        }
    ];
}

function buildBaseData(t: (key: string) => string): Record<string, ReflexOpportunityData> {
    return {
        streaming: {
            title: t("reflex.defaultTitle"),
            subtitle: t("reflex.defaultSubtitle"),
            urgent: true,
            steps: [
                { id: "s1", text: t("reflex.step1") },
                { id: "s2", text: t("reflex.step2") },
                { id: "s3", text: t("reflex.step3") },
                { id: "s4", text: t("reflex.step4") }
            ],
            buttonText: t("reflex.howTo"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.page1.socialTitle"),
                author: "Leto",
                views: t("reflex.page1.socialViews"),
                initials: "L",
                descriptionTitle: t("reflex.page1.socialDescTitle"),
                description: t("reflex.page1.socialDesc")
            },
            pages: buildStreamingPages(t)
        },
        social: {
            title: t("reflex.social.title"),
            subtitle: t("reflex.social.subtitle"),
            urgent: true,
            steps: [
                { id: "t1", text: t("reflex.social.step1") },
                { id: "t2", text: t("reflex.social.step2") },
                { id: "t3", text: t("reflex.social.step3") },
                { id: "t4", text: t("reflex.social.step4") }
            ],
            buttonText: t("reflex.social.buttonText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.social.socialTitle"),
                author: "Mister V",
                views: t("reflex.social.socialViews"),
                initials: "M",
                descriptionTitle: t("reflex.social.socialDescTitle"),
                description: t("reflex.social.socialDesc")
            },
            pages: buildSocialPages(t)
        },
        radio: {
            title: t("reflex.radio.title"),
            subtitle: t("reflex.radio.subtitle"),
            urgent: false,
            steps: [
                { id: "r1", text: t("reflex.radio.step1") },
                { id: "r2", text: t("reflex.radio.step2") },
                { id: "r3", text: t("reflex.radio.step3") },
                { id: "r4", text: t("reflex.radio.step4") }
            ],
            buttonText: t("reflex.radio.buttonText"),
            socialProof: {
                videoSrc: pickUniqueFromPool(SOCIAL_PROOF_THUMBNAIL_POOL, 1)[0],
                title: t("reflex.radio.socialTitle"),
                author: "Ninho",
                views: t("reflex.radio.socialViews"),
                initials: "N",
                descriptionTitle: t("reflex.radio.socialDescTitle"),
                description: t("reflex.radio.socialDesc")
            },
            pages: buildRadioPages(t)
        }
    };
}

/**
 * Generates dynamic opportunity data based on the current moment.
 * Simulates fresh data injection from a backend.
 * @param t - Translation function from useTranslation(). If not provided, falls back to FR keys as identity.
 * @param lang - Language code ('fr' | 'en') for date formatting.
 */
export function generateOpportunityData(t?: (key: string) => string, lang: string = 'fr'): Record<string, ReflexOpportunityData> {
    // Fallback: if no t provided, use identity (returns key, which matches FR values in BASE_DATA)
    const translate = t || ((key: string) => key);
    const dateLocale = getDateLocale(lang);
    
    const now = new Date();
    const todayStr = format(now, "d MMMM", { locale: dateLocale });
    const yesterdayStr = format(subDays(now, 1), "d MMMM", { locale: dateLocale });
    
    // Simulate random variations to make it feel "live"
    const randomViewCount = Math.floor(Math.random() * 50) + 10;
    const randomListenerCount = Math.floor(Math.random() * 200) + 100;
    
    // Build translated base data
    const data = buildBaseData(translate);
    // Deep copy to avoid mutation issues with pages arrays
    const result: Record<string, ReflexOpportunityData> = JSON.parse(JSON.stringify(data));

    // --- Re-randomize all video thumbnails on each call ---
    const POOL_MAP: Record<string, string[]> = {
        streaming: STREAMING_THUMBNAIL_POOL,
        social: SOCIAL_THUMBNAIL_POOL,
        radio: RADIO_THUMBNAIL_POOL
    };
    for (const ns of ['streaming', 'social', 'radio'] as const) {
        const nsPool = POOL_MAP[ns];
        const proofPool = SOCIAL_PROOF_THUMBNAIL_POOL;
        if (result[ns].socialProof) {
            result[ns].socialProof!.videoSrc = proofPool[Math.floor(Math.random() * proofPool.length)];
        }
        if (result[ns].pages) {
            const playlistImgs = pickUniqueFromPool(nsPool, result[ns].pages!.length);
            const proofImgs = pickUniqueFromPool(proofPool, result[ns].pages!.length);
            result[ns].pages!.forEach((page: any, i: number) => {
                if (page.playlist) page.playlist.videoSrc = playlistImgs[i] || nsPool[Math.floor(Math.random() * nsPool.length)];
                if (page.socialProof) page.socialProof.videoSrc = proofImgs[i] || proofPool[Math.floor(Math.random() * proofPool.length)];
            });
        }
    }

    // Inject dynamic data into Streaming
    const viewsStr = `${randomViewCount}.${Math.floor(Math.random()*9)}`;
    result.streaming.subtitle = interpolate(translate("reflex.streaming.dynamicSubtitle"), {
        views: viewsStr,
        date: yesterdayStr,
        listeners: randomListenerCount
    });
    if (result.streaming.socialProof) {
        const socialViewCount = `${Math.floor(Math.random() * 500) + 200}`;
        result.streaming.socialProof.views = interpolate(translate("reflex.streaming.dynamicSocialViews"), { views: socialViewCount }) + ` \u2022 ${todayStr}`;
    }

    // Inject dynamic data into Social
    result.social.subtitle = interpolate(translate("reflex.social.dynamicSubtitle"), { date: yesterdayStr });
    if (result.social.socialProof) {
        const socialViews = `${(Math.random() * 2 + 1).toFixed(1)}`;
        result.social.socialProof.views = interpolate(translate("reflex.social.dynamicSocialViews"), { views: socialViews }) + ` \u2022 ${todayStr}`;
    }

    // Inject dynamic data into Radio
    const radioDay = format(addDays(now, 2), "EEEE", { locale: dateLocale });
    result.radio.subtitle = interpolate(translate("reflex.radio.dynamicSubtitle"), { day: radioDay });
    if (result.radio.socialProof) {
        result.radio.socialProof.views = translate("reflex.radio.dynamicSocialViews") + ` \u2022 ${format(now, "MMMM yyyy", { locale: dateLocale })}`;
    }

    return result;
}