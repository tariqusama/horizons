export interface SubStep {
    id: string;
    sectionTitle: string;
    subSectionTitle: string;
    tabLabel: string;
    questions: any[];
}

export function capitalizeName(name: string): string {
    if (!name) return 'Applicant';
    return name
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

export function personalizeQuestionText(text: string, applicantName: string): string {
    if (!text) return '';
    const name = capitalizeName(applicantName);
    const possessiveName = name.endsWith('s') ? `${name}'` : `${name}'s`;

    let output = text
        .replace(/\{applicant_name\}|\{full_name\}|\{name\}|\[Applicant Name\]|\[Applicant\]|\[Name\]/gi, name)
        .replace(/\{first_name\}|\[First Name\]/gi, name.split(' ')[0] || name)
        .replace(/\{last_name\}|\[Last Name\]/gi, name.split(' ').slice(1).join(' ') || name)
        .replace(/\{possessive_name\}|\[Possessive Name\]/gi, possessiveName);

    if (output !== text) {
        return output;
    }

    const trimmed = text.trim();
    const cleanLower = trimmed.toLowerCase().replace(/[?:.*]/g, '').trim();

    if (/^height(\s*\(.*\))?$/i.test(cleanLower) || /^how tall are you$/i.test(cleanLower)) {
        return `How tall is ${name}?`;
    }
    if (/^weight(\s*\(.*\))?$/i.test(cleanLower) || /^how much do you weigh$/i.test(cleanLower) || /^how much does/i.test(cleanLower)) {
        return `How much does ${name} weigh?`;
    }
    if (/^eye color$/i.test(cleanLower)) {
        return `What is ${possessiveName} eye color?`;
    }
    if (/^hair color$/i.test(cleanLower)) {
        return `What is ${possessiveName} hair color?`;
    }
    if (/^class of admission$/i.test(cleanLower)) {
        return `What is ${possessiveName} Class of Admission?`;
    }
    if (/^date of admission$/i.test(cleanLower)) {
        return `What was ${possessiveName} Date of Admission?`;
    }
    if (/^mother'?s first name$/i.test(cleanLower)) {
        return `What is ${possessiveName} mother's first name?`;
    }
    if (/^father'?s first name$/i.test(cleanLower)) {
        return `What is ${possessiveName} father's first name?`;
    }
    if (/^ethnicity$/i.test(cleanLower)) {
        return `What is ${possessiveName} ethnicity?`;
    }
    if (/^race$/i.test(cleanLower)) {
        return `What is ${possessiveName} race?`;
    }
    if (/^daytime telephone number$/i.test(cleanLower) || /^daytime phone number$/i.test(cleanLower)) {
        return `What is ${possessiveName} daytime phone number?`;
    }
    if (/^mobile telephone number$/i.test(cleanLower) || /^mobile phone number$/i.test(cleanLower)) {
        return `What is ${possessiveName} mobile phone number?`;
    }
    if (/^email address$/i.test(cleanLower)) {
        return `What is ${possessiveName} email address?`;
    }

    if (/^are you\b/i.test(trimmed)) {
        return trimmed.replace(/^are you\b/i, `Is ${name}`);
    }
    if (/^have you\b/i.test(trimmed)) {
        return trimmed.replace(/^have you\b/i, `Has ${name}`);
    }
    if (/^do you\b/i.test(trimmed)) {
        return trimmed.replace(/^do you\b/i, `Does ${name}`);
    }

    return trimmed.replace(/\byour\b/gi, possessiveName).replace(/\byou\b/gi, name);
}

export function buildFormSteps(formSchema: any, applicantName: string): SubStep[] {
    const steps: SubStep[] = [];
    const name = capitalizeName(applicantName);

    steps.push({
        id: 'basic-info',
        sectionTitle: 'Personal Information',
        subSectionTitle: `${name}'s Basic Information`,
        tabLabel: 'Personal Information',
        questions: [
            {
                field_name: 'name_group',
                question_text: `What is the full legal name of the ${name}?`,
                field_type: 'name_group',
                is_required: true,
                help_text: `This is the Applicant's CURRENT full legal name, including first, middle, and last names.`
            },
            {
                field_name: 'sameNameAsCard',
                question_text: `Is this the same name that is on ${name}'s Green Card?`,
                field_type: 'radio_yes_no',
                is_required: true,
                help_text: `Just answer 'No' if ${name}'s name has changed since the Green Card was issued.`,
                options: [
                    { option_label: 'Yes', option_value: 'Yes' },
                    { option_label: 'No', option_value: 'No' }
                ]
            },
            {
                field_name: 'gender',
                question_text: `What is the sex of the Applicant?`,
                field_type: 'radio_gender',
                is_required: true,
                help_text: `USCIS allows individuals to self-identify their gender marker. The selected gender will not be required to match the gender marker from their supporting documentation, and no additional documentation will be required. Currently, USCIS only recognizes two sexes 'Male' and 'Female'.`,
                options: [
                    { option_label: 'Female', option_value: 'Female' },
                    { option_label: 'Male', option_value: 'Male' }
                ]
            }
        ]
    });

    if (!formSchema?.sections) return steps;

    const seenFields = new Set<string>(['firstname', 'lastname', 'email', 'phone']);

    formSchema.sections.forEach((section: any, idx: number) => {
        const questions = (section.questions || []).filter((q: any) => {
            const fn = (q.field_name || '').toLowerCase();
            if (seenFields.has(fn)) return false;
            seenFields.add(fn);
            return true;
        }).map((q: any) => {
            const labelLower = (q.question_text || '').toLowerCase();
            let newHelp = q.help_text || '';
            if (labelLower.includes('alien registration number') || labelLower.includes('a-number')) {
                if (!newHelp.includes('[IMAGE:')) {
                    newHelp += ` [IMAGE:/assets/images/greencard-alien.svg]`;
                }
            } else if (labelLower.includes('uscis online account number')) {
                if (!newHelp.includes('[IMAGE:')) {
                    newHelp += ` [IMAGE:/assets/images/greencard-details.svg]`;
                }
            }
            return {
                ...q,
                help_text: newHelp.trim()
            };
        });

        if (questions.length === 0) return;

        const cleanTitle = section.title.replace(/^Part\s*\d+\.?\s*/i, '').trim();

        steps.push({
            id: `sec-${section.id || idx}`,
            sectionTitle: section.title,
            subSectionTitle: `${name}'s ${cleanTitle}`,
            tabLabel: cleanTitle || `Step ${idx + 2}`,
            questions: questions
        });
    });

    return steps;
}
