import ddg from "@mudbill/duckduckgo-images-api";
import { search, SafeSearchType } from "duck-duck-scrape";

const duckduckgo = {
  getImage: async (query: string) => {
    try {
      const images = await ddg.image_search({
        query: `${query}`,
        moderate: true,
        iterations: 1,
        retries: 1,
      });

      const image = images.sort((a, b) => b.width - a.width)[0]?.image;

      // TODO: Add a placeholder empty image
      if (!image) return "";

      return image;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get an image");
    }
  },
  search: async (query: string) => {
    try {
      const searchResults = await search(query, {
        safeSearch: SafeSearchType.STRICT,
      });

      const references = searchResults.results?.slice(0, 10).map((result) => ({
        title: result.title.trim(),
        url: result.url,
      }));

      return references;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to search");
    }
  },
};

export default duckduckgo;
