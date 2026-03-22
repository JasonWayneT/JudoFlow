const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || '';

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnailUrl: string;
    channelTitle: string;
}

export const youtubeService = {

    async searchTechnique(technique: string): Promise<YouTubeVideo | null> {
        if (!technique) return null;

        if (!YOUTUBE_API_KEY) {
            console.warn("No YouTube API Key found. Returning mock video.");
            // Return a very famous Kodokan judo video stub
            return {
                id: "mock_video_id",
                title: `Kodokan Judo: ${technique} Tutorial`,
                thumbnailUrl: "https://img.youtube.com/vi/mock_video_id/hqdefault.jpg",
                channelTitle: "KODOKAN"
            };
        }

        try {
            // Bias search towards high-quality instruction channels (Kodokan, IJF, Neil Adams)
            const searchQuery = encodeURIComponent(`${technique} judo tutorial kodokan OR ijf OR "neil adams"`);

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&key=${YOUTUBE_API_KEY}`
            );

            if (!response.ok) {
                throw new Error("YouTube API Error");
            }

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const item = data.items[0];
                return {
                    id: item.id.videoId,
                    title: item.snippet.title,
                    thumbnailUrl: item.snippet.thumbnails.high.url,
                    channelTitle: item.snippet.channelTitle
                };
            }
            return null;

        } catch (error) {
            console.error("YouTube Search Error", error);
            return null;
        }
    }
};
