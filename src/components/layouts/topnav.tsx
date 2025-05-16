import { ReactNode, useEffect, useState } from 'react'
import styles from './topnav.module.scss'
import { Alert } from 'components/alert'
import { Header } from './header'
import { Footer } from './footer'
import { Newsletter } from 'components/newsletter'
import { TitleWithAction } from './title-action'
import { GITCOIN_GRANT } from 'utils/constants'

type Props = {
  title?: string
  action?: {
    href: string
    text: string
  }
  hideNewsletter?: boolean
  className?: string
  children: ReactNode
}

export function TopnavLayout(props: Props) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme)
      // Also set it on the document element to ensure global styles work
      document.documentElement.className = savedTheme
    }

    // Listen for theme changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue)
        document.documentElement.className = e.newValue
      }
    }

    // For same-tab communication
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme')
      if (currentTheme) {
        setTheme(currentTheme)
        document.documentElement.className = currentTheme
      }
    }

    window.addEventListener('storage', handleStorageChange)
    document.addEventListener('themeChanged', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('themeChanged', handleThemeChange)
    }
  }, [])

  let className = `${styles.container}`
  if (props.className) className += ` ${props.className}`

  return (
    <div className={className} data-theme={theme}>
      {/* <Alert
        text="Test your Web3 knowledge and claim your ZK certifications @ the new useWeb3 Academy"
        url="https://academy.useweb3.xyz/"
        type="info"
        center
      /> */}

      {/* <Alert text="🌱 If you like useWeb3 - considering donating in the current Gitcoin Grants round." url={GITCOIN_GRANT} type="success" center /> */}

      <Header />

      <main className={styles.content}>
        <div className={styles.inner}>
          {props.title && <TitleWithAction title={props.title} action={props.action} />}

          {props.children}

          {/* TODO: Add back in */}
          {/* {!props.hideNewsletter && (
            <div className={styles.center}>
              <Newsletter className={styles.newsletter} />
            </div>
          )} */}
        </div>
      </main>

      <Footer />
    </div>
  )
}
