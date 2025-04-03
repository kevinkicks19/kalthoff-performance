import { createClient } from 'contentful';

// Initialize the Contentful client
export const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

// Define the Video type
export interface Video {
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl: string;
  order: number;
}

// Function to fetch all videos
export async function getVideos(): Promise<Video[]> {
  try {
    const response = await client.getEntries({
      content_type: 'video',
      order: 'fields.order',
    });

    return response.items.map((item: any) => ({
      title: item.fields.title,
      description: item.fields.description,
      videoId: item.fields.videoId,
      thumbnailUrl: item.fields.thumbnailUrl,
      order: item.fields.order,
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
} 