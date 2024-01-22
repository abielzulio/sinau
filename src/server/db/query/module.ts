import { type Prisma } from "@prisma/client";
import { type Database } from "../index";

export const subjectModule = {
  getById: async (db: Database, id: string) => {
    const data = await db.module.findUnique({
      where: { id },
      include: {
        video: true
      },
    });

    return data
  },
};

export type ModuleWithVideo = Prisma.PromiseReturnType<typeof subjectModule["getById"]>
