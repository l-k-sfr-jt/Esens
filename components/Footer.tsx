import Image from 'next/image';

export function Footer() {
  return (
    <footer className="wrapper grid gap-12 pt-20 text-neutral-100">
      <div className="grid justify-items-center lg:justify-items-start">
        <p className="uppercase pb-2">developer projektu</p>
        <Image src="/logo.svg" alt="Daramis" width={170} height={45} />
      </div>
      <div className="grid lg:grid-cols-2 rtl justify-items-center gap-10 lg:items-end uppercase">
        <div className="flex items-center flex-col lg:flex-row gap-y-6 lg:justify-self-start lg:gap-x-40">
          <a href="#" className="hover:underline">
            GDPR
          </a>
          <a href="#" className="hover:underline">
            MADE BY APADORE
          </a>
        </div>
        <div className="text-center lg:text-left text-xs max-w-3/4 lg:justify-self-end">
          <p className="pb-4">
            Uveřejněné vizualizace a jiná vyobrazení na webových stránkách a dalších materiálech
            jsou pouze ilustrační. Mohou se měnit, jsou nezávazné a nepředstavují nabídku ani návrh
            na uzavření smlouvy.
          </p>
          <p>© 2024 Park Living, s.r.o. Všechna práva vyhrazena</p>
        </div>
      </div>
    </footer>
  );
}
