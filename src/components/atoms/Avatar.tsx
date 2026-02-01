import Image from "next/image";

// src/components/atoms/Avatar.tsx
export const Avatar = ({ src }: { src: string }) => (
  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border-custom ring-2 ring-background">
    <Image
      src={src}
      alt="User Profile"
      fill
      className="object-cover"
      sizes="40px"
    />
  </div>
);
