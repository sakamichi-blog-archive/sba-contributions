import { AppProps } from 'next/app'
import "../styles/main.scss"
import "../styles/index.scss"
import "../styles/year.scss"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}