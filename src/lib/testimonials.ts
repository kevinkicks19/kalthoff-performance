import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Define types for testimonials
export type Testimonial = {
  content: string;
  name: string;
  title: string;
};

// Function to parse CSV testimonials
export async function parseTestimonialsFromCSV(): Promise<Testimonial[]> {
  try {
    // Try multiple approaches to locate the file
    let csvPath = '';
    let fileExists = false;
    
    // Approach 1: Using process.cwd()
    try {
      csvPath = path.resolve(process.cwd(), 'public', 'docs', 'Testimonials_JSON.csv');
      await fs.access(csvPath);
      console.log('Found CSV file using process.cwd() at:', csvPath);
      fileExists = true;
    } catch (error) {
      console.log('Could not find CSV file using process.cwd()');
    }
    
    // Approach 2: Relative path
    if (!fileExists) {
      try {
        csvPath = './public/docs/Testimonials_JSON.csv';
        await fs.access(csvPath);
        console.log('Found CSV file using relative path at:', csvPath);
        fileExists = true;
      } catch (error) {
        console.log('Could not find CSV file using relative path');
      }
    }
    
    // Approach 3: Absolute path
    if (!fileExists) {
      try {
        csvPath = 'C:\\Users\\kevin\\OneDrive\\Projects\\KalthoffPerformance\\public\\docs\\Testimonials_JSON.csv';
        await fs.access(csvPath);
        console.log('Found CSV file using absolute path at:', csvPath);
        fileExists = true;
      } catch (error) {
        console.log('Could not find CSV file using absolute path');
      }
    }
    
    if (!fileExists) {
      console.error('Testimonials CSV file not found after trying multiple paths');
      return [];
    }
    
    // Read the CSV file
    const data = await fs.readFile(csvPath, 'utf-8');
    console.log('Successfully read CSV file');
    
    // Parse CSV
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    
    // Find the column indices for our data
    const testimonialIndex = headers.findIndex(h => h.trim().toLowerCase() === 'testimonial');
    const nameIndex = headers.findIndex(h => h.trim().toLowerCase() === 'name');
    const positionIndex = headers.findIndex(h => h.trim().toLowerCase() === 'position');
    const organizationIndex = headers.findIndex(h => h.trim().toLowerCase() === 'organization');
    
    if (testimonialIndex === -1 || nameIndex === -1) {
      console.error('CSV file missing required columns (testimonial or name)');
      return [];
    }
    
    const testimonials: Testimonial[] = [];
    
    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      // Handle CSV parsing with quoted values that may contain commas
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Extract data
      const testimonial = values[testimonialIndex]?.trim().replace(/^"|"$/g, '') || '';
      const name = values[nameIndex]?.trim() || '';
      
      // Combine position and organization for the title
      let title = '';
      if (positionIndex !== -1 && values[positionIndex]?.trim()) {
        title = values[positionIndex].trim();
      }
      
      if (organizationIndex !== -1 && values[organizationIndex]?.trim()) {
        title = title 
          ? `${title}, ${values[organizationIndex].trim()}`
          : values[organizationIndex].trim();
      }
      
      if (testimonial && name) {
        testimonials.push({
          content: testimonial,
          name,
          title
        });
        console.log(`Added testimonial from ${name}`);
      }
    }
    
    console.log('Successfully parsed', testimonials.length, 'testimonials from CSV');
    return testimonials;
    
  } catch (error) {
    console.error('Error parsing testimonials from CSV:', error);
    return [];
  }
}

// Shuffle array helper function
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Get a subset of testimonials for display
export function getDisplayTestimonials(testimonials: Testimonial[], count: number = 5): Testimonial[] {
  const shuffled = shuffleArray(testimonials);
  const selected = shuffled.slice(0, Math.min(count, testimonials.length));
  
  // If we have no testimonials, add a placeholder
  if (selected.length === 0) {
    selected.push({
      content: "Working with Kalthoff Performance has transformed my athletic abilities. The personalized programming and attention to detail is unmatched.",
      name: "Athlete",
      title: "Professional Athlete"
    });
  }
  
  return selected;
} 