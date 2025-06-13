// src/lib/growth-data/zscoreCalc.ts
import growthData from "../../public/growthData.json";

interface LMSDataPoint {
  day: number;
  L: number;
  M: number;
  S: number;
}

type ChartType = "bfa" | "hcfa" | "lhfa" | "wfa";
type Gender = "boys" | "girls";

/**
 * Calculate age in days from two dates.
 */
export function getAgeInDays(dateOfBirth: Date, measurementDate: Date): number {
  return Math.floor((measurementDate.getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Handles edge cases for targetDay outside the data range.
 * Returns the relevant LMSDataPoint if targetDay is at or beyond data boundaries,
 * otherwise returns null if interpolation is needed.
 */
function handleLMSBoundaryCases(data: LMSDataPoint[], targetDay: number): LMSDataPoint | null {
  if (data.length === 0) {
    return null; // No data to process
  }
  const first = data[0];
  const last = data[data.length - 1];

  // Defensive check for malformed data
  if (!first || !last) {
    return null;
  }

  if (targetDay <= first.day) {
    return first; // Target is at or before the first data point
  }
  if (targetDay >= last.day) {
    return last; // Target is at or after the last data point
  }
  return null; // Indicates that targetDay is within the data range, requiring interpolation
}

/**
 * Performs linear interpolation between two LMS data points.
 */
function performLMSInterpolation(
  lower: LMSDataPoint,
  upper: LMSDataPoint,
  targetDay: number
): LMSDataPoint {
  const fraction = (targetDay - lower.day) / (upper.day - lower.day);
  return {
    day: targetDay,
    L: lower.L + fraction * (upper.L - lower.L),
    M: lower.M + fraction * (upper.M - lower.M),
    S: lower.S + fraction * (upper.S - lower.S),
  };
}

/**
 * Interpolates LMS data using binary search to find the range.
 * This function assumes targetDay is *within* the data bounds,
 * as boundary cases are handled by `handleLMSBoundaryCases` before calling this.
 *
 * @returns {LMSDataPoint | null} The interpolated LMS data point, or null if a suitable range isn't found.
 */
function interpolateLMS(data: LMSDataPoint[], targetDay: number): LMSDataPoint | null {
  // Binary search to find the lower bound (index `high`)
  let low = 0;
  let high = data.length - 1;
  let lowerBoundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const current = data[mid];

    if (current.day === targetDay) {
      return current; // Exact match found, no interpolation needed
    }

    if (current.day < targetDay) {
      lowerBoundIndex = mid; // Found a potential lower bound
      low = mid + 1;
    } else {
      high = mid - 1; // Target is in the lower half
    }
  }

  // At this point, if no exact match, `lowerBoundIndex` should point to the element
  // just before `targetDay`, and `lowerBoundIndex + 1` to the element just after.
  const lower = data[lowerBoundIndex];
  const upper = data[lowerBoundIndex + 1];

  // This check is a safeguard; ideally, `handleLMSBoundaryCases`
  // ensures `lower` and `upper` exist and are valid for interpolation.
  if (!lower || !upper || lower.day === upper.day) {
    // If lower.day === upper.day, it means we have duplicate days or data.length < 2,
    // which prevents meaningful interpolation.
    return null;
  }

  return performLMSInterpolation(lower, upper, targetDay);
}

/**
 * Main Z-score calculation.
 */
export function calculateZScore(
  chartType: ChartType,
  gender: Gender,
  ageInDays: number,
  measurementValue: number
): number | null {
  const chart = growthData[chartType];
  const lmsData = chart?.[gender];

  if (!lmsData || !Array.isArray(lmsData) || lmsData.length === 0) {
    return null;
  }

  // Step 1: First, check for boundary conditions
  const lmsAtBoundary = handleLMSBoundaryCases(lmsData, ageInDays);

  let finalLMS: LMSDataPoint | null = null;

  if (lmsAtBoundary !== null) {
    // If it's a boundary case, use this LMS data directly
    finalLMS = lmsAtBoundary;
  } else {
    // If not a boundary, then interpolate
    finalLMS = interpolateLMS(lmsData, ageInDays);
  }

  if (!finalLMS) {
    // This covers cases where interpolation failed (e.g., malformed data)
    console.warn("Failed to retrieve or interpolate LMS data.");
    return null;
  }

  const { L, M, S } = finalLMS;

  // Validate LMS values before calculation
  if (M === null || S === null || M === undefined || S === undefined || S === 0) {
    console.warn(`LMS data invalid for Z-score calculation: L=${L}, M=${M}, S=${S}`);
    return null;
  }

  // WHO LMS Z-score formula
  // Using a small epsilon (1e-6) to check if L is effectively zero to avoid division by zero.
  return Math.abs(L) < 1e-6
    ? Math.log(measurementValue / M) / S
    : ((measurementValue / M) ** L - 1) / (S * L);
}
