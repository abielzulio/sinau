import { Innertube } from "youtubei.js";

const client = await Innertube.create();

const youtube = {
  getVideo: async (query: string) => {
    const search = await client.search(query, {
      type: "video",
      sort_by: "relevance",
      duration: "medium",
    });

    const result = search.videos[0] as unknown as {
      id: string;
      title: {
        text: string;
      };
      thumbnails: { url: string }[];
    };

    const data = {
      id: result.id,
      title: result.title.text,
      cover: result.thumbnails[0]?.url ?? "",
    };

    return data;
  },
};

export default youtube;
