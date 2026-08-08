import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

async function extractFields() {
    const rootDir = path.join(process.cwd(), '..');
    const files = await fs.readdir(rootDir);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf') && !f.toLowerCase().includes('checklist'));

    const schemas = [];

    for (const file of pdfFiles) {
        console.log(`Processing ${file}...`);
        try {
            const pdfBytes = await fs.readFile(path.join(rootDir, file));
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const form = pdfDoc.getForm();
            const fields = form.getFields();

            const slug = file.replace('.pdf', '').toLowerCase();
            const formSchema = {
                slug: slug,
                name: `Form ${slug.toUpperCase()}`,
                description: `Dynamic form generated from ${file}`,
                sections: []
            };

            const questions = [];
            for (const field of fields) {
                const name = field.getName();
                const type = field.constructor.name;
                
                let fieldType = 'text';
                if (type.includes('CheckBox')) fieldType = 'checkbox';
                if (type.includes('RadioGroup')) fieldType = 'radio';
                if (type.includes('Dropdown')) fieldType = 'select';

                questions.push({
                    field_name: name,
                    question_text: name,
                    field_type: fieldType,
                    is_required: false,
                    help_text: ''
                });
            }

            // Group into generic sections (e.g. 10 questions per section)
            const chunkSize = 20;
            for (let i = 0; i < questions.length; i += chunkSize) {
                formSchema.sections.push({
                    title: `Part ${Math.floor(i / chunkSize) + 1}`,
                    description: '',
                    order_index: Math.floor(i / chunkSize),
                    questions: questions.slice(i, i + chunkSize).map((q, idx) => ({ ...q, order_index: idx }))
                });
            }

            schemas.push(formSchema);
        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    }

    await fs.writeFile(path.join(rootDir, 'form_schemas.json'), JSON.stringify(schemas, null, 2));
    console.log('Finished writing form_schemas.json');
}

extractFields();
