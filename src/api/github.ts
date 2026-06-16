// GitHub API helper for reading/writing JSON data files
const GITHUB_API = 'https://api.github.com';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

function getConfig(): GitHubConfig {
  return {
    token: process.env.GITHUB_TOKEN || '',
    owner: process.env.GITHUB_OWNER || '',
    repo: process.env.GITHUB_REPO || '',
    branch: 'main'
  };
}

export async function getJsonFile(filePath: string): Promise<any> {
  const config = getConfig();
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} - ${res.statusText}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content: JSON.parse(content), sha: data.sha };
}

export async function updateJsonFile(filePath: string, content: any, sha: string): Promise<any> {
  const config = getConfig();
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${filePath}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Update ${filePath}`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      sha,
      branch: config.branch
    })
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} - ${res.statusText}`);
  }

  return res.json();
}

export async function deleteFromArray(filePath: string, id: string): Promise<any> {
  const { content, sha } = await getJsonFile(filePath);
  const updated = content.filter((item: any) => item.id !== id);
  return updateJsonFile(filePath, updated, sha);
}

export async function addToArray(filePath: string, item: any): Promise<any> {
  const { content, sha } = await getJsonFile(filePath);
  content.push(item);
  return updateJsonFile(filePath, content, sha);
}

export async function updateInArray(filePath: string, item: any): Promise<any> {
  const { content, sha } = await getJsonFile(filePath);
  const index = content.findIndex((i: any) => i.id === item.id);
  if (index !== -1) {
    content[index] = { ...content[index], ...item };
  }
  return updateJsonFile(filePath, content, sha);
}
