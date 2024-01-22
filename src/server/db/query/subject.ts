import type Database from "../index";

export const subject = {
  getById: async (db: typeof Database, id: string) => {
    const data = await db.query.subject.findFirst({
      with: {
        modules: {
          with: {
            video: true,
            chats: true,
          },
        },
      },
      where: (subject, { eq }) => eq(subject.id, id),
    });

    return data;
  },

  getAll: async (db: typeof Database, userId: string) => {
    const data = await db.query.subject.findMany({
      where: (subject, { eq }) => eq(subject.userId, userId),
    });

    return data;
  },
};

export type SubjectWithModulesAndVideo = ReturnType<
  (typeof subject)["getById"]
> extends Promise<infer T>
  ? T
  : never;
