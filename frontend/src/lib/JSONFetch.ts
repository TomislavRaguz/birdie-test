export async function JSONFetch (url: string, options?: { 
  body?: Record<string, any> ,
  method?: "GET" | "DELETE" | "POST" | "PATCH"
}) {
  if(!options) options = {}
  const res = await fetch(url, {
    method: options.method || 'POST',
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  if(res.status >= 400) {
    console.log('err res', res)
    const err = await res.json()
    throw err
  }
  return res.json();
}