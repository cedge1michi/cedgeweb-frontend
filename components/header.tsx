'use client';

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceSite } from "@/lib/definitions";

const buildDocumentTitle = (baseTitle: string) => `${baseTitle} | ${serviceSite.name}`;

const PATH_TITLE_OVERRIDES: Record<string, string> = {
    "/": serviceSite.title,
    "/services": buildDocumentTitle("サービス"),
    "/profile": buildDocumentTitle("会社概要"),
    "/contact": buildDocumentTitle("お問い合わせ"),
};

const NAV_ITEMS = [
    { label: "HOME", href: "/" },
    { label: "SERVICES", href: "/services" },
    { label: "PROFILE", href: "/profile" },
    { label: "CONTACT", href: "/contact" },
];

export default function Header() {
    const pathname = usePathname();
    const fallbackTitle = useMemo(() => {
        if (pathname in PATH_TITLE_OVERRIDES) {
            return PATH_TITLE_OVERRIDES[pathname];
        }
        return serviceSite.title;
    }, [pathname]);

    const [hiddenTitle, setHiddenTitle] = useState(fallbackTitle);

    useEffect(() => {
        if (typeof document !== "undefined" && document.title) {
            setHiddenTitle(document.title);
            return;
        }
        setHiddenTitle(fallbackTitle);
    }, [pathname]);

    return (
        <header className="container mx-auto px-4">
            <h1 className="sr-only">{hiddenTitle}</h1>
            <div className="flex w-full flex-wrap items-center md:flex-nowrap md:justify-between">
                <div className="inline-flex h-20 w-full flex-shrink-0 items-center md:w-auto">
                    <Link href="/" aria-label="サイバーエッジ株式会社 トップページ">
                        <Image
                            src="/CYBEREDGE.svg"
                            width={300}
                            height={80}
                            priority
                            alt="サイバーエッジ株式会社"
                        />
                    </Link>
                </div>
                <nav
                    id="navbar_menu"
                    aria-label="グローバルナビゲーション"
                    className="inline-flex w-full items-center justify-end gap-x-4 pb-2 text-sm md:w-auto md:gap-x-6 md:pb-0 md:pr-8 md:text-base"
                >
                    <ul className="flex items-center gap-x-4 md:gap-x-6">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={
                                            isActive
                                                ? "text-orange-400 transition hover:text-gray-400"
                                                : "transition hover:text-gray-400"
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
