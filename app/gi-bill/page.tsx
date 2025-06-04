import type { Metadata } from "next";
import { PointsGate } from "@/components/points-gate";
import GIBillContent from "./content";

export const metadata: Metadata = {
  title: "G.I. Bill Benefits | SF Deputy Sheriff Recruitment",
  description:
    "Learn how to use your G.I. Bill benefits to fund your training and education as a San Francisco Deputy Sheriff. Comprehensive guide for veterans.",
  keywords:
    "G.I. Bill, veterans benefits, military to law enforcement, deputy sheriff training, education benefits",
};

export default function GIBillPage() {
  return (
    <PointsGate
      requiredPoints={300}
      pageName="G.I. Bill Benefits"
      pageDescription="Learn how to use your G.I. Bill benefits to fund your training and education as a San Francisco Deputy Sheriff."
      imageUrl="/veterans-law-enforcement-training.png"
    >
      <GIBillContent />
    </PointsGate>
  );
}
