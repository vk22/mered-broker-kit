type PageSeoOptions = {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  image: MaybeRefOrGetter<string>;
  imageAlt: MaybeRefOrGetter<string>;
  path?: MaybeRefOrGetter<string>;
  type?: 'website' | 'article';
};

export const usePageSeo = (options: PageSeoOptions) => {
  const route = useRoute();
  const requestUrl = useRequestURL();
  const config = useRuntimeConfig();

  const siteOrigin = computed(() => {
    const configuredUrl = String(config.public.siteUrl || '').trim();
    return (configuredUrl || requestUrl.origin).replace(/\/$/, '');
  });
  const canonicalUrl = computed(
    () => `${siteOrigin.value}${toValue(options.path ?? route.path)}`,
  );
  const imageUrl = computed(() => {
    const image = toValue(options.image);
    return image.startsWith('http') ? image : `${siteOrigin.value}${image}`;
  });

  useSeoMeta({
    title: () => toValue(options.title),
    description: () => toValue(options.description),
    robots: 'index, follow, max-image-preview:large',
    ogTitle: () => toValue(options.title),
    ogDescription: () => toValue(options.description),
    ogType: options.type ?? 'website',
    ogUrl: () => canonicalUrl.value,
    ogImage: () => imageUrl.value,
    ogImageSecureUrl: () => imageUrl.value,
    ogImageType: 'image/jpeg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => toValue(options.imageAlt),
    twitterCard: 'summary_large_image',
    twitterTitle: () => toValue(options.title),
    twitterDescription: () => toValue(options.description),
    twitterImage: () => imageUrl.value,
    twitterImageAlt: () => toValue(options.imageAlt),
  });

  useHead({
    link: [
      {
        rel: 'canonical',
        href: () => canonicalUrl.value,
      },
    ],
  });

  return {
    canonicalUrl,
    imageUrl,
    siteOrigin,
  };
};
