import db from "@/lib/db";

export async function getAllStaff({
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

    const [staff, totalRecords] = await Promise.all([
      db.staff.findMany({
        skip: SKIP,

        take: LIMIT,
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
      db.staff.count(),
    ]);

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      currentPage: PAGE_NUMBER,
      data: staff,
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
