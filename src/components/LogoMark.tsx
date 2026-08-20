import Image from "next/image";

export function LogoMark() {
  return (
    <span className="logo-mark">
      <Image
        src="/images/logo-clean.webp"
        alt="Silicone Solutions C.I. Ltd"
        width={512}
        height={321}
        sizes="(max-width: 767px) 128px, 168px"
        className="h-auto w-full"
        priority
      />
    </span>
  );
}
