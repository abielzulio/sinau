import { eq } from "drizzle-orm";
import Database, { Subject, Video, Module } from "../index";

export const ModuleWithVideo = {
  getById: async (db: typeof Database, id: string): Promise<any[]> => {
    const data = await db
      .select()
      .from(Subject)
      .leftJoin(Module, eq(Subject.id, Module.id))
      .leftJoin(Video, eq(Module.videoId, Video.id))
      .where(eq(Subject.id, id));

    return data;
  },
};
