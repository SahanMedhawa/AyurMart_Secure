/**
 * Utility to extract and sanitize image URLs.
 * If a seller pastes a Google Images search result link (e.g. https://www.google.com/imgres?q=...&imgurl=http%3A%2F%2F...&imgrefurl=...),
 * this function automatically extracts the actual direct image file URL from the `imgurl` query parameter.
 */
export const cleanImageUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    const trimmed = rawUrl.trim();

    // Check if it's a Google Images redirect/wrapper link
    if (trimmed.includes('google.') && (trimmed.includes('imgurl=') || trimmed.includes('/imgres'))) {
        try {
            const urlObj = new URL(trimmed);
            const imgurl = urlObj.searchParams.get('imgurl') || urlObj.searchParams.get('mediaurl');
            if (imgurl) {
                return decodeURIComponent(imgurl);
            }
        } catch (e) {
            const match = trimmed.match(/[?&](?:imgurl|mediaurl)=([^&]+)/i);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        }
    }

    return trimmed;
};
