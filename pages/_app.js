import '../styles/index.css'
import { withTina } from 'tinacms'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withTina(MyApp)
