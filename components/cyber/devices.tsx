"use client";

import type { ReactNode } from "react";

// Blocky, crisp-edged pixel-style device illustrations. Monochrome steel line
// work with a single red sensor accent. Sized to fill their container.

const STEEL = "#c6ccd6";
const RED = "#ff2233";

type Props = { className?: string };

function Svg({ children, className, vb = "0 0 120 120" }: { children: ReactNode; className?: string; vb?: string }) {
  return (
    <svg
      viewBox={vb}
      className={className}
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      stroke={STEEL}
      fill="none"
      strokeWidth={3}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {children}
    </svg>
  );
}

export function PixelDrone({ className }: Props) {
  return (
    <Svg className={className}>
      {/* arms */}
      <path d="M30 30 L52 52 M90 30 L68 52 M30 90 L52 68 M90 90 L68 68" />
      {/* rotors */}
      <rect x="18" y="18" width="20" height="20" />
      <rect x="82" y="18" width="20" height="20" />
      <rect x="18" y="82" width="20" height="20" />
      <rect x="82" y="82" width="20" height="20" />
      <path d="M22 28 H34 M88 28 H100 M22 92 H34 M88 92 H100" strokeWidth={2} />
      {/* body */}
      <rect x="48" y="48" width="24" height="24" />
      {/* camera gimbal */}
      <rect x="54" y="72" width="12" height="10" />
      <rect x="57" y="82" width="6" height="6" fill={RED} stroke={RED} />
    </Svg>
  );
}

export function PixelCamera({ className }: Props) {
  return (
    <Svg className={className}>
      {/* mount */}
      <path d="M20 96 H40 M30 96 V70" />
      <rect x="22" y="60" width="16" height="12" />
      {/* body */}
      <rect x="34" y="44" width="54" height="30" />
      {/* lens */}
      <rect x="84" y="50" width="14" height="18" />
      <rect x="98" y="54" width="6" height="10" fill={RED} stroke={RED} />
      {/* top light */}
      <rect x="44" y="36" width="10" height="8" />
    </Svg>
  );
}

export function PixelRoomba({ className }: Props) {
  return (
    <Svg className={className} vb="0 0 140 90">
      {/* disc */}
      <path d="M16 56 H124 M16 56 Q16 30 40 26 H100 Q124 30 124 56" />
      <path d="M16 56 V62 Q16 70 40 70 H100 Q124 70 124 62 V56" />
      {/* bumper seam */}
      <path d="M28 56 H112" strokeWidth={2} />
      {/* sensor tower */}
      <rect x="60" y="34" width="20" height="14" />
      <rect x="66" y="38" width="8" height="6" fill={RED} stroke={RED} />
      {/* wheels */}
      <rect x="30" y="66" width="14" height="10" />
      <rect x="96" y="66" width="14" height="10" />
    </Svg>
  );
}

export function PixelRobotArm({ className }: Props) {
  return (
    <Svg className={className}>
      {/* base */}
      <rect x="40" y="98" width="40" height="12" />
      <rect x="52" y="84" width="16" height="14" />
      {/* lower segment */}
      <path d="M60 84 L40 50" strokeWidth={6} />
      {/* joint */}
      <rect x="34" y="44" width="14" height="14" />
      {/* upper segment */}
      <path d="M41 51 L86 36" strokeWidth={6} />
      {/* gripper */}
      <rect x="84" y="28" width="14" height="14" />
      <path d="M98 30 H108 M98 40 H108" />
      <rect x="89" y="32" width="6" height="6" fill={RED} stroke={RED} />
    </Svg>
  );
}

export const DEVICES = { drone: PixelDrone, camera: PixelCamera, roomba: PixelRoomba, arm: PixelRobotArm };
