import { format } from "date-fns";

import db from "@/lib/db";

export const getVitalSignData = async (id: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await db.vitalSigns.findMany({
    orderBy: {
      created_at: "asc",
    },
    select: {
      created_at: true,
      diastolic: true,
      heartRate: true,
      systolic: true,
    },
    where: {
      created_at: {
        gte: sevenDaysAgo,
      },
      patient_id: id,
    },
  });
  // 56 - 60
  const formatVitals = data?.map((record) => ({
    diastolic: record.diastolic,
    label: format(new Date(record.created_at), "MMM d"),
    systolic: record.systolic,
  }));

  const formattedData = data.map((record) => {
    const heartRates = record.heartRate.split("-").map((rate) => Number.parseInt(rate.trim()));

    return {
      label: format(new Date(record.created_at), "MMM d"),
      value1: heartRates[0],
      value2: heartRates[1],
    };
  });

  const totalSystolic = data?.reduce((sum, acc) => sum + acc.systolic, 0);
  const totalDiastolic = data?.reduce((sum, acc) => sum + acc.diastolic, 0);

  const totalValue1 = formattedData?.reduce((sum, acc) => sum + acc.value1, 0);
  const totalValue2 = formattedData?.reduce((sum, acc) => sum + acc.value2, 0);

  const count = data?.length;

  const averageSystolic = totalSystolic / count;
  const averageDiastolic = totalDiastolic / count;

  const averageValue1 = totalValue1 / count;
  const averageValue2 = totalValue2 / count;

  const average = `${averageSystolic.toFixed(2)}/${averageDiastolic.toFixed(2)} mg/dL`;
  const averageHeartRate = `${averageValue1.toFixed(2)}-${averageValue2.toFixed(2)} bpm`;

  return {
    average,
    averageHeartRate,
    data: formatVitals,
    heartRateData: formattedData,
  };
};
