import Image from "next/image";

export function LogoMark() {
  return (
    <span className="logo-mark">
      <span className="logo-mark__image">
        <Image
          src="/images/logo.jpg"
          alt="Silicone Solutions C.I. Ltd"
          fill
          sizes="(max-width: 767px) 128px, 168px"
          className="logo-mark__asset"
          priority
        />
      </span>
    </span>
  );
}
