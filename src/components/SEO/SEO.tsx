import Head from "next/head";

interface Props {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  url?: string | null;
}

/**
 * Provide SEO related meta tags to a page.
 *
 * @param {Props} props The props object.
 * @param {string} props.title Used for the page title, og:title, twitter:title, etc.
 * @param {string} props.description Used for the meta description, og:description, twitter:description, etc.
 * @param {string} props.imageUrl Used for the og:image and twitter:image. NOTE: Must be an absolute url.
 * @param {string} props.url Used for the og:url and twitter:url.
 *
 * @returns {React.ReactElement} The SEO component
 */
export default function SEO({ title, description, imageUrl, url }: Props) {
  if (!title && !description && !imageUrl && !url) {
    return null;
  }

  const descriptionNoHtmlTags = description?.replace(/<[^>]*>?/gm, "") || "";

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        {title && (
          <>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta property="og:title" content={title} />
            <meta property="twitter:title" content={title} />
          </>
        )}

        {!!descriptionNoHtmlTags && (
          <>
            <meta name="description" content={descriptionNoHtmlTags} />
            <meta property="og:description" content={descriptionNoHtmlTags} />
            <meta
              property="twitter:description"
              content={descriptionNoHtmlTags}
            />
          </>
        )}

        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta property="twitter:image" content={imageUrl} />
          </>
        )}

        {url && (
          <>
            <meta property="og:url" content={url} />
            <meta property="twitter:url" content={url} />
          </>
        )}
      </Head>
    </>
  );
}
