'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceSite } from "@/lib/definitions";

const NAV_ITEMS = [
    { label: "HOME", href: "/" },
    { label: "SERVICES", href: "/services" },
    { label: "PROFILE", href: "/profile" },
    { label: "CONTACT", href: "/contact" },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="container mx-auto px-4">
            <h1 className="sr-only">{serviceSite.title}</h1>
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
