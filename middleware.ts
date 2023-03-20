import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const PUBLIC_FILE = /\.(.*)$/;

// had to make this again here as the other one is in file with bcrypt which is not supported on edge runtime
const verifyJWT = async (token) => {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  return payload;
};

export default async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/register') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const jwt = req.cookies.get(process.env.COOKIE_NAME);


  if (!jwt) {
    req.nextUrl.pathname = '/signin';
    return NextResponse.redirect(req.nextUrl);
  }

  try {
    await verifyJWT(jwt.value);
    return NextResponse.next();
  } catch (e) {
    req.nextUrl.pathname = '/signin';
    return NextResponse.redirect(req.nextUrl);
  }
}
