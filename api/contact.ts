import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_API = 'https://api.github.com';

async function getGitHub(filePath: string) {
  const res = await fetch(`${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}?ref=main`, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  });
  if (!res.ok) throw new Error(`GitHub: ${res.status}`);
  const data = await res.json();
  return { content: JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')), sha: data.sha };
}

async function putGitHub(filePath: string, content: any, sha: string) {
  const res = await fetch(`${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Update ${filePath}`, content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'), sha, branch: 'main' })
  });
  if (!res.ok) throw new Error(`GitHub: ${res.status}`);
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const FILE = 'data/contact.json';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { content } = await getGitHub(FILE);
      return res.json(content);
    }
    if (req.method === 'POST') {
      const { content, sha } = await getGitHub(FILE);
      const msg = { ...req.body, id: `MSG-${Date.now()}`, createdAt: new Date().toISOString() };
      content.push(msg);
      await putGitHub(FILE, content, sha);
      return res.json({ success: true });
    }
    if (req.method === 'DELETE') {
      const { content, sha } = await getGitHub(FILE);
      const updated = content.filter((i: any) => i.id !== req.query.id);
      await putGitHub(FILE, updated, sha);
      return res.json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
