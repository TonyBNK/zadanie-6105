import { Bid, Tender } from "./models/entity";
import { BidReview } from "./models/entity/bid.model";
import { BidReviewViewModel, BidViewModel } from "./models/view/bid.model";
import { TenderViewModel } from "./models/view/tender.model";

export function getHostAndPort(url: string): { host: string; port: string } {
  const parsedUrl = new URL(url);
  const { hostname, port } = parsedUrl;

  return {
    host: hostname,
    port: port || "5000",
  };
}

export function tenderToViewModel(tender: Tender): TenderViewModel {
  return {
    id: tender.id,
    name: tender.name,
    description: tender.description,
    serviceType: tender.serviceType,
    status: tender.status,
    version: tender.version,
    createdAt: tender.createdAt.toISOString(),
  };
}

export function bidToViewModel(bid: Bid): BidViewModel {
  return {
    id: bid.id,
    name: bid.name,
    description: bid.description,
    status: bid.status,
    tenderId: bid.tenderId,
    authorType: bid.authorType,
    authorId: bid.authorId,
    version: bid.version,
    createdAt: bid.createdAt.toISOString(),
  };
}

export function bidReviewToViewModel(bidReview: BidReview): BidReviewViewModel {
  return {
    id: bidReview.id,
    description: bidReview.description,
    createdAt: bidReview.createdAt.toISOString(),
  };
}

export function sortArray<T>(
  arr: T[],
  sortBy: keyof T | ((item: T) => string),
  sortDirection: "asc" | "desc"
): T[] {
  return arr.sort((a, b) => {
    let valueA, valueB;

    if (typeof sortBy === "function") {
      valueA = sortBy(a);
      valueB = sortBy(b);
    } else {
      valueA = a[sortBy] as string;
      valueB = b[sortBy] as string;
    }

    const [letterA, numberA] = parseStringParts(valueA);
    const [letterB, numberB] = parseStringParts(valueB);

    if (letterA < letterB) return sortDirection === "asc" ? -1 : 1;
    if (letterA > letterB) return sortDirection === "asc" ? 1 : -1;
    if (numberA < numberB) return sortDirection === "asc" ? -1 : 1;
    if (numberA > numberB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

function parseStringParts(value: string): [string, number] {
  const match = value.toString().match(/(\D+)(\d*)/);
  if (match) {
    const [, letter, number] = match;
    return [letter, parseInt(number || "0", 10)];
  }
  return ["", 0];
}
