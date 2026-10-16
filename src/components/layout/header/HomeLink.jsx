import { Link } from 'react-router'
import { site } from '../../../config/site'

/**
 * The header lockup (mark + AURATHUS AI), back to the top of the home page
 * from anywhere. The image is decorative; the link carries the name, which
 * starts with the words the logo shows.
 */
export default function HomeLink() {
  const { home } = site.nav
  const { header } = site.brand

  return (
    <Link
      to={home.href}
      aria-label={`${site.shortName}, ${home.label}`}
      className="flex h-11 items-center opacity-90 transition-opacity duration-500 ease-aura hover:opacity-100 focus-visible:opacity-100"
    >
      <img
        src={header.src}
        width={header.width}
        height={header.height}
        alt=""
        draggable={false}
        className="h-[30px] w-auto select-none lg:h-[34px]"
      />
    </Link>
  )
}
