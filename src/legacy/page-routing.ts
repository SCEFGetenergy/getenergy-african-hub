// React-owned paths must bypass static legacy page lookup.
const APP_PAGES = ['/account', '/admin', '/academy', '/team-invite', '/admin-setup', '/training-certification', '/sophia', '/request-energy-quote', '/policies', '/solutions', '/answers', '/r'];

export function isReactPage(pathname: string): boolean {
  return APP_PAGES.some(path => pathname === path || pathname.startsWith(`${path}/`));
}