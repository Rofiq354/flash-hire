// src/components/atoms/Avatar.tsx
export const Avatar = ({ src }: { src: string }) => (
  <div className="h-10 w-10 rounded-full overflow-hidden border border-border-custom ring-2 ring-background">
    <img src={src} alt="User Profile" className="h-full w-full object-cover" />
  </div>
);
