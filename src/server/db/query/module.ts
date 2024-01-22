import type Database from "../index";

export const subjectModule = {
  getById: async (db: typeof Database, id: string) => {
    return await db.query.subjectModule.findFirst({
      with: {
        video: true,
      },
      where: (module, { eq }) => eq(module.id, id),
    });
  },
};

export type SubjectModuleWithVideo = ReturnType<
  (typeof subjectModule)["getById"]
> extends Promise<infer T>
  ? T
  : never;
