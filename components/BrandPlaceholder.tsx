import Image from 'next/image'
import Link from 'next/link'

type BrandPlaceholderProps = {
  name: string
  eyebrow: string
  description: string
  imageSrc?: string
  imageAlt?: string
}

export default function BrandPlaceholder({
  name,
  eyebrow,
  description,
  imageSrc,
  imageAlt,
}: BrandPlaceholderProps) {
  return (
    <div className="min-h-dvh bg-surface-brand">
      <div className="screen-wrap">
        <div className="mobile-frame min-h-dvh bg-surface-page">
          <header className="flex items-center justify-between px-5 pt-6 pb-4">
            <Link
              href="/"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-secondary"
            >
              ← Nobu retreats
            </Link>
            <span className="rounded-full bg-surface-subtle px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-text-secondary">
              Prototype
            </span>
          </header>

          <div className="px-5 pb-10">
            {imageSrc ? (
              <div className="relative mb-8 h-48 w-full overflow-hidden rounded-default">
                <Image
                  src={imageSrc}
                  alt={imageAlt ?? name}
                  fill
                  className="object-cover"
                  sizes="390px"
                  priority
                />
              </div>
            ) : (
              <div className="mb-8 flex h-48 items-center justify-center rounded-default bg-surface-inverse">
                <span className="font-serif text-4xl italic text-text-inverse">{name}</span>
              </div>
            )}

            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-text-brand">
              {eyebrow}
            </p>
            <h1 className="mb-4 font-serif text-[2.25rem] leading-[1.1] text-text-primary">{name}</h1>
            <p className="mb-8 text-[15px] leading-relaxed text-text-secondary">{description}</p>

            <div className="rounded-default border border-border-default bg-surface-default p-5">
              <p className="text-[13px] leading-relaxed text-text-secondary">
                This property prototype is scaffolded for corporate retreats and MICE. Pages and flows
                will be added here as design iterations land—same path-based hosting as Nobu Los Cabos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
