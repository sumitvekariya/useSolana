import styles from './header.module.scss'
import { Link } from 'components/link'
import Icon from 'assets/images/icon.svg'
import { useRef, useState, useEffect } from 'react'
import { Searchbar } from './searchbar'
import { useOnOutsideClick } from 'hooks/useOnOutsideClick'
import { MobileSubmenu } from './submenu'

type Props = {
  className?: string
}

export const MENU_ITEMS = [
  { url: `/books`, icon: '📚', text: 'Books', category: 'explore' },
  { url: `/guides`, icon: '📖', text: 'Guides', category: 'explore' },
  { url: `/podcasts`, icon: '🎙️', text: 'Podcasts', category: 'explore' },
  { url: `/movies`, icon: '🎬', text: 'Movies', category: 'explore' },
  { url: `/websites`, icon: '🌐', text: 'Websites', category: 'explore' },
  { url: `/tags`, icon: '🏷️', text: 'Tags', category: 'explore' },
  { url: `/code-challenges`, icon: '🏆', text: 'Challenges', category: 'learn' },
  { url: `/courses`, icon: '🎓', text: 'Courses', category: 'learn' },
  { url: `/tutorials`, icon: '💻', text: 'Tutorials', category: 'learn' },
  { url: `/videos`, icon: '📺', text: 'Videos', category: 'learn' },
  { url: `/contribute`, icon: '✨', text: 'Contribute', category: 'build' },
  { url: `/earn`, icon: '💸', text: 'Earn', category: 'build' },
  { url: `/grants`, icon: '💰', text: 'Grants', category: 'build' },
  { url: `/starter-kits`, icon: '🏗️', text: 'Templates', category: 'build' },
]

export function Header(props: Props) {
  let className = `${styles.container}`
  if (props.className) className += ` ${props.className}`

  const ref = useRef(null)
  const [foldout, setFoldout] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  useOnOutsideClick(ref, () => setFoldout(''))

  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.className = 'dark'

      // Force body style update
      document.body.style.backgroundColor = '#121218'
      document.body.style.color = '#F9FAFB'
    } else {
      setIsDarkMode(false)
      document.documentElement.className = 'light'

      // Reset body styles
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }
  }, [])

  function toggleTheme() {
    const newTheme = !isDarkMode ? 'dark' : 'light'
    setIsDarkMode(!isDarkMode)

    // Apply theme to HTML element
    document.documentElement.className = newTheme

    // Store theme preference
    localStorage.setItem('theme', newTheme)

    // Force body style update
    if (newTheme === 'dark') {
      document.body.style.backgroundColor = '#121218'
      document.body.style.color = '#F9FAFB'
    } else {
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }

    // Dispatch custom event for same-tab communication
    document.dispatchEvent(new Event('themeChanged'))
  }

  function onClose() {
    setFoldout('')
  }

  return (
    <header className={className} ref={ref}>
      <div className={styles.main}>
        <Link href="/" className={styles.icon}>
          <Icon />
        </Link>

        <ul className={styles.navigation}>
          <li className={styles.primary}>
            <span>Explore</span>
            <aside className={styles.foldout}>
              <ul className={styles.subnav}>
                {MENU_ITEMS.filter((i) => i.category === 'explore').map((i) => {
                  return (
                    <li key={i.url}>
                      <Link href={i.url}>
                        <span>{i.icon}</span>
                        {i.text}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </li>
          <li className={styles.primary}>
            <span>Learn</span>
            <aside className={styles.foldout}>
              <ul className={styles.subnav}>
                {MENU_ITEMS.filter((i) => i.category === 'learn').map((i) => {
                  return (
                    <li key={i.url}>
                      <Link href={i.url}>
                        <span>{i.icon}</span>
                        {i.text}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </li>
          <li className={styles.primary}>
            <span>Build</span>
            <aside className={styles.foldout}>
              <ul className={styles.subnav}>
                {MENU_ITEMS.filter((i) => i.category === 'build').map((i) => {
                  return (
                    <li key={i.url}>
                      <Link href={i.url}>
                        <span>{i.icon}</span>
                        {i.text}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </li>
        </ul>

        <ul className={styles.icons}>
          <li onClick={toggleTheme} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`} />
          </li>
          <li className={styles.emoji}>
            <Link href="/gas">⛽</Link>
          </li>
          <li onClick={() => setFoldout(foldout !== 'search' ? 'search' : '')}>
            <i className="bi bi-search" />
          </li>
          <li className={styles.hamburger} onClick={() => setFoldout(foldout !== 'submenu' ? 'submenu' : '')}>
            <i className="bi bi-list" />
          </li>
        </ul>
      </div>

      <MobileSubmenu
        className={`${styles.submenu} ${foldout === 'submenu' ? styles.open : ''}`}
        open={foldout === 'submenu'}
        close={() => onClose()}
      />

      <Searchbar className={`${styles.foldout} ${foldout === 'search' ? styles.open : ''}`} open={foldout === 'search'} close={() => onClose()} />
    </header>
  )
}
