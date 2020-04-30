import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import { useState, useEffect, useMemo } from 'react'
import { useForm, usePlugin } from 'tinacms'

export default function Post({ post: initialPost, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !initialPost?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const formConfig = {
    id: initialPost.slug,
    label: 'Blog Post',
    initialValues: initialPost,
    onSubmit: (values) => {
      alert(`Submitting ${values.title}`)
    },
    fields: [
      {
        name: 'title',
        label: 'Post Title',
        component: 'text',
      },
      {
        name: 'rawMarkdownBody',
        label: 'Content',
        component: 'markdown',
      },
    ],
  }

  const [post, form] = useForm(formConfig)
  usePlugin(form)

  const [htmlContent, setHtmlContent] = useState(post.content)
  const initialContent = useMemo(() => post.rawMarkdownBody, [])
  useEffect(() => {
    if (initialContent == post.rawMarkdownBody) return
    markdownToHtml(post.rawMarkdownBody).then(setHtmlContent)
  }, [post.rawMarkdownBody])

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={htmlContent} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
        rawMarkdownBody: post.content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      }
    }),
    fallback: false,
  }
}
