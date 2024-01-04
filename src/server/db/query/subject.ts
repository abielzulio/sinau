import { type Prisma } from "@prisma/client";
import { type Database } from "../index";

export const subject = {
  getById: async (db: Database, id: string) => {
    const data = await db.subject.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            video: true,
          },
        },
      },
    });

    return data;
  },
  getAll: async (db: Database, userId: string, page: number) => {
    const data = await db.subject.findMany({
      select: {
        id: true,
        name: true,
        cover: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
        modules: {
          select: {
            id: true,
          },
        },
      },
      where: { userId },
      skip: page * 10,
      take: 10,
      orderBy: { createdAt: "desc" },
    });

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
