export function getDynamicDateRange(daysAgo: number = 30): string {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysAgo);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const frLocale = 'fr-FR';
    
    const startStr = startDate.toLocaleDateString(frLocale, options);
    const endStr = today.toLocaleDateString(frLocale, options);

    return `${startStr} - ${endStr}`;
}

export function getCurrentDateFormatted(): string {
    return new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getLastMonthName(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toLocaleDateString('fr-FR', { month: 'long' });
}

export function getCurrentMonthName(): string {
    return new Date().toLocaleDateString('fr-FR', { month: 'long' });
}
