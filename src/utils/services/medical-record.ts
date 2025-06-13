import type { Prisma } from "@prisma/client";

import db from "@/lib/db";

export async function getMedicalRecords({
  limit,
  page,
  search,
}: {
  page: number | string;
  limit?: number | string;
  search?: string;
}) {
  try {
    const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
    const LIMIT = Number(limit) || 10;

    const SKIP = (PAGE_NUMBER - 1) * LIMIT;

    const where: Prisma.MedicalRecordsWhereInput = {
      OR: [
        {
          patient: {
            first_name: { contains: search, mode: "insensitive" },
          },
        },
        {
          patient: {
            last_name: { contains: search, mode: "insensitive" },
          },
        },
        { patient_id: { contains: search, mode: "insensitive" } },
      ],
    };

    const [data, totalRecords] = await Promise.all([
      db.medicalRecords.findMany({
        include: {
          diagnosis: {
            include: {
              doctor: {
                select: {
                  colorCode: true,
                  img: true,
                  name: true,
                  specialization: true,
                },
              },
            },
          },

          lab_test: true,
          patient: {
            select: {
              colorCode: true,
              date_of_birth: true,
              first_name: true,
              gender: true,
              img: true,
              last_name: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip: SKIP,
        take: LIMIT,
        where: where,
      }),
      db.medicalRecords.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      currentPage: PAGE_NUMBER,
      data,
      status: 200,
      success: true,
      totalPages,
      totalRecords,
    };
  } catch (error) {
    console.log(error);
    return { message: "Internal Server Error", status: 500, success: false };
  }
}
