import Image from "next/image";

// src/components/atoms/Avatar.tsx
export const Avatar = ({
  src,
  className = "h-10 w-10",
}: {
  src?: string | null;
  className?: string;
}) => {
  const defaultAvatar = "/avatar-default.svg";
  const imagePath = src && src.trim() !== "" ? src : defaultAvatar;
  return (
    <div
      className={`relative ${className} rounded-full overflow-hidden border border-border-custom ring-2 ring-background`}
    >
      <Image
        src={imagePath}
        alt="User Profile"
        fill
        className="object-cover"
        sizes="150px"
        quality={90}
        priority
      />
    </div>
  );
};
