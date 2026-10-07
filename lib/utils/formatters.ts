/**
 * Format form/application field keys into human-readable titles with spaces.
 * e.g.:
 *   "petitionerFamilyName" -> "Petitioner Family Name"
 *   "petitionerMiddleName" -> "Petitioner Middle Name"
 *   "petitionerMailingStreet" -> "Petitioner Mailing Street"
 *   "NAME_GROUP_FIRST" -> "Name Group First"
 *   "name_group_first" -> "Name Group First"
 *   "dateOfBirth" -> "Date Of Birth"
 *   "uscisOnlineAccount" -> "USCIS Online Account"
 *   "aNumber" -> "A Number"
 *   "ssn" -> "SSN"
 *   "dob" -> "DOB"
 */
export function formatFieldLabel(key: string): string {
    if (!key || typeof key !== 'string') return '';

    const formatted = key
        // Insert space before uppercase letters that follow lowercase letters or digits
        // e.g. "petitionerFamilyName" -> "petitioner Family Name"
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        // Insert space between consecutive uppercase letters and a capitalized word
        // e.g. "USCISAccount" -> "USCIS Account"
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        // Replace underscores and dashes with spaces
        .replace(/[_-]+/g, ' ')
        // Remove duplicate spaces
        .replace(/\s+/g, ' ')
        .trim();

    if (!formatted) return '';

    return formatted
        .split(' ')
        .map(word => {
            // Keep common legal/immigration acronyms in uppercase
            if (/^(ssn|dob|uscis|ein|itin|alien|id|zip|apt|ste|flr|po)$/i.test(word)) {
                return word.toUpperCase();
            }
            // Capitalize first character and lowercase the rest
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

/**
 * Resolves the display label for a questionnaire answer item.
 * If actual question text is provided or pathway mapping is available, it returns the real question.
 * Otherwise, if numeric, returns fallback; if string key, formats it into human-readable text.
 */
export function getQuestionnaireLabel(
    key: string,
    allAnswers: Record<string, any> = {},
    goalTitle?: string | null,
    pathways?: Record<string, Array<{ question: string; depends_on_answer?: string | null }>> | null
): string {
    if (isNaN(Number(key)) && !/^\d+[a-zA-Z]?$/.test(key)) {
        return formatFieldLabel(key);
    }

    const stepIndex = parseInt(key, 10);
    if (!stepIndex || !pathways || !goalTitle) {
        return `Question ${key}`;
    }

    const matchedGoal = Object.keys(pathways).find(g => 
        g.toLowerCase() === goalTitle.toLowerCase() ||
        goalTitle.toLowerCase().includes(g.toLowerCase()) ||
        g.toLowerCase().includes(goalTitle.toLowerCase())
    );

    const questions = matchedGoal ? pathways[matchedGoal] : null;
    if (!questions || !Array.isArray(questions)) {
        return `Question ${key}`;
    }

    const answerValues = Object.values(allAnswers).map(v => String(v).trim());
    const visibleQuestions = questions.filter(q => {
        if (!q.depends_on_answer) return true;
        return answerValues.includes(q.depends_on_answer.trim());
    });

    const questionObj = visibleQuestions[stepIndex - 1];
    if (questionObj && questionObj.question) {
        return questionObj.question;
    }

    return `Question ${key}`;
}
