import type { Metadata } from "next";
import { PresentDeck } from "@/components/present/PresentDeck";

export const metadata: Metadata = {
  title: "RoboShield — Pitch",
};

export default function PresentPage() {
  return <PresentDeck />;
}
