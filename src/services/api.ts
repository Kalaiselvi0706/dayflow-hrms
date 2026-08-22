const getHeaders = () => {
  const token = localStorage.getItem('nexora_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async get(url: string) {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      const errorMsg = (await res.json().catch(() => ({}))).message || 'API Request Failed';
      throw new Error(errorMsg);
    }
    return res.json();
  },
  async post(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errorMsg = (await res.json().catch(() => ({}))).message || 'API Request Failed';
      throw new Error(errorMsg);
    }
    return res.json();
  },
  async put(url: string, body: any = {}) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errorMsg = (await res.json().catch(() => ({}))).message || 'API Request Failed';
      throw new Error(errorMsg);
    }
    return res.json();
  },
  async delete(url: string) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorMsg = (await res.json().catch(() => ({}))).message || 'API Request Failed';
      throw new Error(errorMsg);
    }
    return res.json();
  }
};
