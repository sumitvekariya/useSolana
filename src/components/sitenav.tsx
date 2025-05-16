import { Link } from 'components/link'
import { useRouter } from 'next/router'
import { useNavigation } from 'hooks/useNavigation'
import styles from './sitenav.module.scss'

interface Props {
  className?: string
}

export function Sitenav(props: Props) {
  const router = useRouter()
  const categories = useNavigation()
  const currentPath = router.asPath
  let className = styles.container
  if (props.className) className += ` ${props.className}`

  return (
    <nav className={className}>
      <ul className={styles.sidenav}>
        <li className={currentPath === '/' ? styles.active : ''}>
          <Link href="/">
            <span role="img" aria-label="home">
              🏠
            </span>
            <span className={styles.text}>Home</span>
          </Link>
        </li>
        <li className={currentPath.includes('/learn') ? styles.active : ''}>
          <Link href={'/learn'}>
            <span role="img" aria-label="learn">
              🧠
            </span>
            <span className={styles.text}>Learn</span>
          </Link>
        </li>
        {categories.map((i) => {
          return (
            <li key={i.id} className={currentPath.includes(`/${i.id}`) ? styles.active : ''}>
              <Link href={`/${i.id}`}>
                <span role="img" aria-label={i.id}>
                  {i.emoji}
                </span>
                <span className={styles.text}>{i.title}</span>
              </Link>
            </li>
          )
        })}
        <li className={currentPath.includes('/grants') ? styles.active : ''}>
          <Link href={'/grants'}>
            <span role="img" aria-label="grants">
              💰
            </span>
            <span className={styles.text}>Grants</span>
          </Link>
        </li>
        <li className={currentPath.includes('/gas') ? styles.active : ''}>
          <Link href={'/gas'}>
            <span role="img" aria-label="gas">
              ⛽
            </span>
            <span className={styles.text}>Gas</span>
          </Link>
        </li>
        <li className={currentPath.includes('/tags') ? styles.active : ''}>
          <Link href={'/tags'}>
            <span role="img" aria-label="tags">
              🏷️
            </span>
            <span className={styles.text}>Tags</span>
          </Link>
        </li>
        <li className={currentPath.includes('/latest') ? styles.active : ''}>
          <Link href={'/latest'}>
            <span role="img" aria-label="latest">
              ⏱️
            </span>
            <span className={styles.text}>Latest</span>
          </Link>
        </li>
        <li>
          <Link href="https://github.com/sumitvekariya/useSolana/tree/main/content">
            <span role="img" aria-label="submit">
              🔗
            </span>
            <span className={styles.text}>Submit</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
