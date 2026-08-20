import Image from "next/image";

export function LogoMark() {
  return (
    <span className="logo-mark">
      <Image
        src="/images/logo-clean.png"
        alt="Silicone Solutions C.I. Ltd"
        width={1284}
        height={805}
        sizes="(max-width: 767px) 128px, 168px"
        className="h-auto w-full"
        priority
      />
    </span>
  );
}
