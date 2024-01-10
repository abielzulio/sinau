import { eq, desc } from "drizzle-orm";
import Database, { Subject, Video, Module } from "../index";

export const subject = {
  getById: async (db: typeof Database, id: string) => {
    const data = await db
      .select()
      .from(Subject)
      .leftJoin(Module, eq(Subject.id, Module.id))
      .leftJoin(Video, eq(Module.videoId, Video.id))
      .where(eq(Subject.id, id));

    return data;
  },

  getAll: async (db: typeof Database, userId: string) => {
    const data = await db
      .select({
        id: Subject.id,
        name: Subject.name,
        cover: Subject.cover,
        isCompleted: Subject.isCompleted,
        createdAt: Subject.createdAt,
        updatedAt: Subject.updatedAt,
        modules: {
          id: Module.id,
        },
      })
      .from(Subject)
      .leftJoin(Module, eq(Subject.id, Module.id))
      .leftJoin(Video, eq(Module.videoId, Video.id))
      .where(eq(Subject.userId, userId))
      .orderBy(desc(Subject.createdAt));

    return data;
  },
};

export type SubjectWithModulesAndVideo = ReturnType<
  (typeof subject)["getById"]
> extends Promise<infer T>
  ? T
  : never;

/* export type SubjectWithModulesAndVideo = Prisma.SubjectGetPayload<{
  include: {
    modules: {
      include: {
        video: true;
      };
    };
  };
}>;
 */
