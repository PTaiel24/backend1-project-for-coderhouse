const buildPageLink = (basePath, query, page) => {
  if (!page) return null;

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (key !== "page" && value !== undefined) {
      params.set(key, String(value));
    }
  });
  params.set("page", String(page));

  return `${basePath}?${params.toString()}`;
};

export default buildPageLink;
