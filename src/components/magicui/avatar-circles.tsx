import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Array<{
    imageUrl: string;
    profileUrl: string;
  }>;
}

export function AvatarCircles({
  className,
  numPeople = 99,
  avatarUrls,
}: AvatarCirclesProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {avatarUrls.slice(0, 5).map((avatar, i) => (
        <a
          href={avatar.profileUrl}
          key={avatar.profileUrl}
          className={cn(
            "relative inline-block h-8 w-8 rounded-full border-2 border-white dark:border-black",
            i !== 0 && "-ml-3",
          )}
          style={{
            zIndex: avatarUrls.length - i,
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={avatar.imageUrl}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
            width={32}
            height={32}
          />
        </a>
      ))}
      {avatarUrls.length > 5 && (
        <div
          className={cn(
            "relative -ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white ring-2 ring-white dark:ring-black",
          )}
          style={{
            zIndex: 0,
          }}
        >
          +{numPeople}
        </div>
      )}
    </div>
  );
} 