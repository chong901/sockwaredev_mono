export const callLTAApi = async <T>(url: string) => {
  const res = await fetch(url, {
    headers: { AccountKey: process.env.LTA_API_KEY! },
  });
  return res.json() as T;
};
