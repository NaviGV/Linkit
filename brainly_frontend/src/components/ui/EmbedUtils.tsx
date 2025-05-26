
 export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  let videoId: string | null = null;

  try {
    const urlObj = new URL(url);

   
    if ((urlObj.hostname === "www.youtube.com" || urlObj.hostname === "youtube.com") && urlObj.pathname === "/watch") {
      videoId = urlObj.searchParams.get("v");
    }
    
    else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.substring(1); 
    }
    
    else if (urlObj.hostname === "www.youtube.com" && urlObj.pathname.startsWith("/embed/")) {
      videoId = urlObj.pathname.substring("/embed/".length);
    }
  

  } catch (error) {
    
    console.error("Malformed URL provided to extractYouTubeVideoId:", url, error);
    return null;
  }

 
  const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
  if (videoId && YOUTUBE_ID_REGEX.test(videoId)) {
    return videoId;
  }
 
  if (YOUTUBE_ID_REGEX.test(url)) {
      return url;
  }

  console.warn("Could not extract a valid YouTube Video ID from URL:", url);
  return null;
};



export const getYouTubeEmbedUrl = (urlOrId: string): string | null => {
  const videoId = extractYouTubeVideoId(urlOrId);

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`; 
  }
  return null;
};


export const getTwitterEmbedLink = (url: string): string => {
  if (!url) return "";
  try {
    const urlObj = new URL(url); 
    if (urlObj.hostname === "twitter.com" || urlObj.hostname === "www.twitter.com" ||
        urlObj.hostname === "x.com" || urlObj.hostname === "www.x.com") {
      return url.replace("x.com", "twitter.com");
    }
    console.warn("URL does not appear to be a Twitter/X URL:", url);
    return "";
  } catch (error) {
    console.error("Invalid URL for Twitter link:", url, error);
    return "";
  }
};
