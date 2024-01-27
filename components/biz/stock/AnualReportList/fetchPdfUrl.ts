'use server';
export const fetchPdfUrl = async (article: string) => {
  const url = 'https://np-cnotice-stock.eastmoney.com/api/content/ann';
  const search = new URLSearchParams({
    art_code: `${article}`,
    client_source: 'web',
    page_index: '1',
  });
  const res = await (await fetch(`${url}?${search.toString()}`)).json();
  return res.data.attach_url;
};
