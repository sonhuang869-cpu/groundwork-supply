import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ui'
import { live } from '../lib/catalogue'

export default function NotFound() {
  return (
    <div className="shell py-20 md:py-28">
      <div className="max-w-xl">
        <p className="label">404</p>
        <h1 className="h1 mt-2">That page has gone.</h1>
        <p className="mt-4 text-base text-ink-2">
          Products get retired when the numbers stop working. These are the ones still running.
        </p>
        <ul className="mt-7 border-t border-line">
          {live().map(p => (
            <li key={p.slug} className="border-b border-line">
              <Link to={`/p/${p.slug}`} className="block py-3.5 text-sm font-semibold hover:text-brand">{p.name}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink to="/" tone="ink">Back to the store</ButtonLink>
          <ButtonLink to="/console" tone="outline">Open the console</ButtonLink>
        </div>
      </div>
    </div>
  )
}
