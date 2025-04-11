import fs from 'fs';
import path from 'path';

export type Testimonial = {
    testimonial: string;
    name: string;
    position: string;
    organization: string;
    image?: string;
};

export async function parseTestimonialsFromJSON(): Promise<Testimonial[]> {
    try {
        const jsonPath = path.join(process.cwd(), 'public', 'docs', 'testimonials_preferred (1).json');
        
        if (!fs.existsSync(jsonPath)) {
            console.error('JSON file not found at:', jsonPath);
            return [];
        }

        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        const testimonials = JSON.parse(fileContent);
        
        console.log(`Successfully loaded ${testimonials.length} testimonials from JSON`);
        return testimonials;
    } catch (error) {
        console.error('Error parsing testimonials from JSON:', error);
        return [];
    }
}

export function getDisplayTestimonials(testimonials: Testimonial[], count?: number): Testimonial[] {
    if (!testimonials?.length) {
        return [];
    }

    // Create a copy of the array
    const shuffled = [...testimonials];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // If count is specified, return that many testimonials
    // Otherwise, return all testimonials
    return count ? shuffled.slice(0, Math.min(count, shuffled.length)) : shuffled;
} 