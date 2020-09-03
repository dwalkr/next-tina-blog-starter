import '../styles/index.css'
import { withTina } from 'tinacms'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withTina(MyApp, {
  enabled: true,
  sidebar: true,
  plugins: [MarkdownFieldPlugin],
})
