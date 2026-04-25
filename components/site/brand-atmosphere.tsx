export function BrandAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="floating-orb absolute left-[-8rem] top-[8rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(183,46,9,0.25),rgba(183,46,9,0))] animate-float-slow" />
      <div className="floating-orb absolute left-[-4rem] top-[12rem] h-[14rem] w-[14rem] rounded-full bg-[radial-gradient(circle,rgba(237,141,117,0.2),rgba(237,141,117,0))] animate-float" />
      <div className="floating-orb-delayed absolute right-[-6rem] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(132,161,143,0.28),rgba(132,161,143,0))] animate-float-slow" />
      <div className="floating-orb-delayed absolute right-[-8rem] top-[10rem] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(244,221,167,0.2),rgba(244,221,167,0))] animate-float" />
      <div className="absolute bottom-[-8rem] left-1/2 h-[22rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,221,167,0.25),rgba(244,221,167,0))] animate-float" />
      <svg className="absolute inset-x-0 top-0 h-[32rem] w-full opacity-70" viewBox="0 0 1440 520" fill="none">
        <path
          d="M-80 219C64 177 132 110 266 116C432 123 468 271 624 280C770 288 794 160 934 145C1093 128 1211 258 1520 184"
          className="ink-line"
        />
        <path
          d="M-44 311C170 269 232 381 423 383C611 385 654 241 818 238C991 235 1125 367 1478 312"
          className="ink-line-secondary"
        />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,238,220,0.3),rgba(245,238,220,0))]" />
      <div className="grain-overlay absolute inset-0 opacity-25" />
    </div>
  );
}
