let PAGE_COUNT = 25;
let KOINLY_API_URL = "https://api.koinly.io";

let getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(";").shift();
};

let fetchHeaders = () => {
  const headers = new Headers();
  headers.append("authority", "api.koinly.io");
  headers.append("accept", "application/json, text/plain, */*");
  headers.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
  headers.append("access-control-allow-credentials", "true");
  headers.append("caches-requests", "1");
  headers.append("cookie", document.cookie);
  headers.append("origin", "https://app.koinly.io");
  headers.append("referer", "https://app.koinly.io/");
  headers.append("sec-fetch-dest", "empty");
  headers.append("sec-fetch-mode", "cors");
  headers.append("sec-fetch-site", "same-site");
  headers.append("sec-gpc", "1");
  headers.append("user-agent", navigator.userAgent);
  headers.append("x-auth-token", getCookie("API_KEY") ?? "");
  headers.append("x-portfolio-token", getCookie("PORTFOLIO_ID") ?? "");
  return headers;
};

let fetchSession = async () => {
  try {
    const response = await fetch(`${KOINLY_API_URL}/api/sessions`, {
      method: "GET",
      headers: fetchHeaders(),
      redirect: "follow",
    });
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Fetch session failed");
  }
};

let fetchPage = async (pageNumber) => {
  try {
    const response = await fetch(
      `${KOINLY_API_URL}/api/transactions?per_page=${PAGE_COUNT}&order=date&page=${pageNumber}`,
      {
        method: "GET",
        headers: fetchHeaders(),
        redirect: "follow",
      }
    );
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error(`Fetch failed for page=${pageNumber}`);
  }
};

let getAllTransactions = async () => {
  const firstPage = await fetchPage(1);
  const totalPages = firstPage.meta.page.total_pages;
  const promises = [];
  for (let i = 2; i <= totalPages; i++) {
    promises.push(fetchPage(i));
  }
  const remainingPages = await Promise.all(promises);
  return remainingPages.reduce((arr, curr) => {
    return [...arr, ...curr.transactions];
  }, firstPage.transactions);
};
