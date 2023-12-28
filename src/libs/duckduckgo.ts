import { type Maybe } from "@/type";
import { SafeSearchType, search } from "duck-duck-scrape";

const BASE_URL = "https://duckduckgo.com/";

type DDGImageResult = {
  height: number;
  image: string;
  image_token: string;
  source: string;
  thumbnail: string;
  thumbnail_token: string;
  title: string;
  url: string;
  width: number;
};

type DDGImageSearchResult = {
  ads: null;
  next: string;
  query: string;
  queryEncoded: string;
  response_type: string;
  results: DDGImageResult[];
};

const HEADERS = {
  dnt: "1",
  "accept-encoding": "gzip, deflate, sdch",
  "x-requested-with": "XMLHttpRequest",
  "accept-language": "en-GB,en-US;q=0.8,en;q=0.6,ms;q=0.4",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
  accept: "application/json, text/javascript, */*; q=0.01",
  referer: "https://duckduckgo.com/",
  authority: "duckduckgo.com",
};
const MAX_RETRIES = 2;

/** Code snippet from https://github.com/KshitijMhatre/duckduckgo-images-api/blob/master/src/api.js with added type-safety and removed unnecessity */
async function getToken(keywords: string) {
  let token: string | null | undefined = null;
  const url = new URL(BASE_URL);
  url.searchParams.append("q", keywords);

  try {
    const res = await fetch(url.href, {
      method: "GET",
    });

    const data = await res.text();

    const match = data.match(/vqd=([\d-]+)\&/);
    token = match ? match[1] : null;
  } catch (error) {
    console.error(error);
  }

  return new Promise((resolve, reject) => {
    if (!token) reject("Failed to get token");
    resolve(token);
  });
}

async function image_search({
  query,
  moderate,
  retries,
}: {
  query: string;
  moderate: boolean;
  retries: number;
}): Promise<Maybe<DDGImageResult>> {
  const reqUrl = BASE_URL + "i.js";
  const keywords = query;
  const p = moderate ? 1 : -1; // by default moderate false
  if (!retries) retries = MAX_RETRIES; // default to max if none provided

  let result: Maybe<DDGImageResult>;

  try {
    const token = await getToken(keywords);

    const params = {
      l: "wt-wt",
      o: "json",
      q: keywords,
      vqd: token as string,
      f: ",,,",
      p: "" + p,
    };

    while (!result) {
      let data: DDGImageSearchResult = {
        ads: null,
        next: "",
        query: "",
        queryEncoded: "",
        response_type: "",
        results: [],
      };

      try {
        const url = new URL(reqUrl);

        Object.keys(params).forEach((key: string) =>
          url.searchParams.append(key, params[key]),
        );

        const response = await fetch(url.href, {
          method: "GET",
          headers: HEADERS,
        });

        data = (await response.json()) as DDGImageSearchResult;
        if (!data.results) {
          throw "No results";
        }
      } catch (error) {
        console.error(error);
      }
      result = data.results[0];
      if (!data.next) {
        return new Promise((resolve, reject) => {
          resolve(result);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

const duckduckgo = {
  getImage: async (query: string) => {
    try {
      const result = await image_search({
        query,
        moderate: true,
        retries: 1,
      });

      // TODO: Add a placeholder empty image
      if (!result?.image) return "";

      return result.image;
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

      const references = searchResults.results?.slice(0, 5).map((result) => ({
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
