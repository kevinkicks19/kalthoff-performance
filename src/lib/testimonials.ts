import fs from 'fs';
import path from 'path';

export type Testimonial = {
    testimonial: string;
    name: string;
    position: string;
    organization: string;
};

export async function parseTestimonialsFromCSV(): Promise<Testimonial[]> {
    try {
        const csvPath = path.join(process.cwd(), 'public', 'docs', 'Testimonials_JSON.csv');
        
        if (!fs.existsSync(csvPath)) {
            console.error('CSV file not found at:', csvPath);
            return [];
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = fileContent.split('\n').slice(1); // Skip header row
        const testimonials: Testimonial[] = [];
        const seenNames = new Set<string>();

        for (const line of lines) {
            // Skip empty lines
            if (!line.trim()) continue;

            // Split by comma, but handle cases where commas are inside quotes
            const parts: string[] = [];
            let currentPart = '';
            let insideQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    parts.push(currentPart.trim());
                    currentPart = '';
                } else {
                    currentPart += char;
                }
            }
            parts.push(currentPart.trim());

            // Clean up quotes from parts
            const [testimonial, name, position, organization] = parts.map(part => 
                part.replace(/^"/, '').replace(/"$/, '').trim()
            );

            // Skip if missing required fields or invalid name
            if (!testimonial || !name || name === 'Sacrifice') {
                continue;
            }

            // Skip duplicates
            if (seenNames.has(name)) {
                continue;
            }

            seenNames.add(name);
            testimonials.push({
                testimonial,
                name,
                position: position || '',
                organization: organization || ''
            });
        }

        console.log(`Successfully loaded ${testimonials.length} testimonials`);
        return testimonials;
    } catch (error) {
        console.error('Error parsing testimonials:', error);
        return [];
    }
}

export function getDisplayTestimonials(testimonials: Testimonial[], count: number = 5): Testimonial[] {
    if (!testimonials?.length || count < 1) {
        return [];
    }

    // Create a copy of the array
    const shuffled = [...testimonials];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, Math.min(count, shuffled.length));
} 