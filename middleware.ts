import { NextRequest, NextResponse } from 'next/server'
import { logger } from './lib/logger'

export function middleware(request: NextRequest, response: NextResponse) {
    const now = new Date();
    const array = [
        now.toISOString(),
        request.method,
        request.nextUrl.pathname,
    ];
    const line = array.join(' ')
        + ' - '
        + request.headers.get('user-agent');
    logger.info(line);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/services/:path*',
        '/profile/:path*',
        '/contact/:path*',
        '/event/:path*',
    ],
}
