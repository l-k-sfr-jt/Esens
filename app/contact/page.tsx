import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Form } from '@/app/contact/Form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Esens Letná | Kontakt',
};

export default function Page() {
  return (
    <>
      <header className="wrapper grid grid-cols-1 xl:grid-rows-[auto_128px]">
        <h1 className="text-5xl lg:text-9xl xl:text-hero tracking-tighter text-accent pb-19 lg:pb-10 xl:pb-0 lg:col-span-full lg:row-start-1 lg:row-end-3">
          Nepropásněte{' '}
          <span className="text-white lg:block ps-5 lg:ps-0 lg:indent-[5ch] xl:indent-[7ch]">
            život
          </span>
          <span className="text-white lg:block lg:indent-[5ch] xl:indent-[7ch]"> na Letné</span>
        </h1>
        <p className="max-w-[53ch] lg:col-span-full lg:self-end xl:row-start-2 xl:row-end-3 lg:-translate-y-1/4">
          Máte otázky nebo si chcete domluvit osobní setkání? Obraťte se na nás a my vám rádi
          odpovíme na vše, co vás zajímá.
        </p>
      </header>
      <main className="relative overflow-x-clip grid grid-cols-(--wrapper-with-image) pt-8 lg:pt-30 xl:pt-40">
        <div className="col-start-2 col-end-3 grid lg:grid-cols-[minmax(0,31rem)_minmax(0,1fr)] lg:gap-37 gap-20">
          <Form />
          <div className="flex flex-col gap-2 lg:gap-6 items-end lg:items-start overflow-hidden">
            <p className="self-start">
              Nemáte rádi formuláře? <span className="lg:block">Ozvěte se nám přímo.</span>
            </p>
            <div>
              <a className="block pb-2 lg:pb-4" href="mailto:sales@daramis.com">
                sales@daramis.com
              </a>
              <a className="block" href="tel:+420 800 226 223">
                +420 800 226 223
              </a>
            </div>
            <Image
              src="/flower.svg"
              alt=""
              width={846}
              height={759}
              className="hidden lg:block top-52 -right-80 absolute"
            />
          </div>
          <section
            className="relative grid col-span-full lg:grid-cols-2 lg:gap-52 gap-20 text-center lg:text-left text-white"
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="sr-only">
              Contact information
            </h2>
            <div>
              <Image
                src="/esens.svg"
                alt="Letna Esens"
                width={540}
                height={170}
                className="px-15 lg:px-0 "
              />
            </div>
            <div className="grid lg:grid-cols-2 gap-6 lg:pt-16">
              <div className="text-lg  uppercase col-span-full flex flex-col lg:flex-row gap-6 lg:gap-22 pb-15">
                <p>Lokalita</p>
                <p>Kontakt</p>
              </div>
              <div>
                <p className="text-xs uppercase pb-2">E-mail</p>
                <a className="hover:underline text-lg " href="mailto:info@esens.cz">
                  info@esens.cz
                </a>
              </div>
              <div className="lg:order-2">
                <p className="text-xs uppercase pb-2">Telefon</p>
                <a className="hover:underline text-lg " href="tel:+420789893029">
                  +420 789 893 029
                </a>
              </div>
              <address aria-labelledby="client-center-heading lg:order-2" className="not-italic">
                <p className="text-xs uppercase pb-2" id="client-center-heading">
                  Klientské centrum
                </p>
                <p className="text-lg">
                  Jankovcova&nbsp;1595/14
                  <br />
                  170&nbsp;00&nbsp;Praha&nbsp;7
                </p>
              </address>
            </div>
            <Image
              src="/leaf-2.svg"
              alt=""
              width={239}
              height={239}
              className="hidden lg:block -bottom-1/2 left-1/6 absolute"
            />
            <Image
              src="/leaf-1.svg"
              alt=""
              width={239}
              height={239}
              className="hidden lg:block bottom-0 left-3/9 absolute"
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
