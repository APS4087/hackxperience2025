import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Array<{
    imageUrl: string;
    profileUrl?: string;
  }>;
}

export function AvatarCircles({
  className,
  numPeople = 99,
  avatarUrls,
}: AvatarCirclesProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {avatarUrls.slice(0, 5).map((avatar, i) => {
        const ImageComponent = (
          <Image
            src={avatar.imageUrl}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
            width={32}
            height={32}
          />
        );

        return avatar.profileUrl ? (
          <a
            href={avatar.profileUrl}
            key={avatar.profileUrl}
            className={cn(
              "relative inline-block h-8 w-8 rounded-full border-2 border-white dark:border-black",
              i !== 0 && "-ml-3",
            )}
            style={{
              zIndex: i,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ImageComponent}
          </a>
        ) : (
          <div
            key={avatar.imageUrl}
            className={cn(
              "relative inline-block h-8 w-8 rounded-full border-2 border-white dark:border-black",
              i !== 0 && "-ml-3",
            )}
            style={{
              zIndex: i,
            }}
          >
            {ImageComponent}
          </div>
        );
      })}
      {avatarUrls.length > 5 && (
        <div
          className={cn(
            "relative -ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm text-white ring-2 ring-white dark:ring-black",
          )}
          style={{
            zIndex: 5,
          }}
        >
          +{numPeople}
        </div>
      )}
    </div>
  );
}

const demoAvatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
    profileUrl: "https://github.com/dillionverma",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
    profileUrl: "https://github.com/tomonarifeehan",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://github.com/BankkRoll",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "https://github.com/safethecode",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59442788",
    profileUrl: "https://github.com/sanjay-mali",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://github.com/itsarghyadas",
  },
];

export function AvatarCirclesDemo() {
  return <AvatarCircles numPeople={99} avatarUrls={demoAvatars} />;
} 