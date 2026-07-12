import { useMemo } from "react";
import { getIcon } from "@/lib/parent/icons";

const SIZES = {
  sm: { box: "h-11 w-11 rounded-xl", icon: 18 },
  md: { box: "h-14 w-14 rounded-2xl", icon: 24 },
  lg: { box: "h-16 w-16 rounded-2xl", icon: 28 },
};

export function ChildAvatar({
  icon,
  size = "md",
}: {
  icon: string;
  size?: keyof typeof SIZES;
}) {
  const Icon = useMemo(() => getIcon(icon), [icon]);
  const { box, icon: iconSize } = SIZES[size];
  return (
    <div className={`flex shrink-0 items-center justify-center bg-teal-100 text-teal-700 ${box}`}>
      {/* eslint-disable-next-line react-hooks/static-components -- intentional dynamic icon-by-key lookup */}
      <Icon size={iconSize} strokeWidth={2} />
    </div>
  );
}
