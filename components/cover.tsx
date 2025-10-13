/**
 * カバー画像のタイトルとサブタイトルを取得する。
 * @param path ページロケーション
 * @returns タイトルとサブタイトル
 */
type CoverInfo = {
    title: string;
    subTitle?: string;
    headingLevel: 'h1' | 'h2' | 'h3';
    titleClass?: string;
    subTitleClass?: string;
};

function getTitleInfo(path: string): CoverInfo {
    switch (path) {
        case '/':
            return {
                title: "Accelerating Business Development",
                subTitle: "CYBEREDGE Inc.",
                headingLevel: 'h1',
                titleClass: "font-bold whitespace-nowrap text-[clamp(2.125rem,6.5vw,3.25rem)]",
                subTitleClass: "text-[2.4rem] font-bold md:text-[2.75rem]",
            };
        case '/services':
            return {
                title: "SERVICES",
                subTitle: "HOME > SERVICES",
                headingLevel: 'h1',
                titleClass: "text-4xl font-bold md:text-5xl",
            };
        case '/profile':
            return {
                title: "PROFILE",
                subTitle: "HOME > PROFILE",
                headingLevel: 'h1',
                titleClass: "text-4xl font-bold md:text-5xl",
            };
        case '/contact':
            return {
                title: "CONTACT",
                subTitle: "HOME > CONTACT",
                headingLevel: 'h1',
                titleClass: "text-4xl font-bold md:text-5xl",
            };
        case '/event':
            return {
                title: "EVENT",
                subTitle: "HOME > EVENT",
                headingLevel: 'h1',
                titleClass: "text-4xl font-bold md:text-5xl",
            };
        default:
            return {
                title: '',
                subTitle: '',
                headingLevel: 'h2',
                titleClass: "text-3xl font-bold md:text-4xl",
            };
    }
}

/**
 * カバーセクションのdiv要素を生成する。
 * @param pathname ページロケーション
 * @returns カバーセクションのdiv要素
 */
export function Cover({
    pathname,
    headingLevel,
}: Readonly<{ pathname: string; headingLevel?: CoverInfo['headingLevel']; }>) {
    const {
        title,
        subTitle,
        headingLevel: defaultHeading,
        titleClass,
        subTitleClass,
    } = getTitleInfo(pathname);
    const HeadingTag = (headingLevel ?? defaultHeading) || 'h1';
    const headingStyles = titleClass ?? "text-4xl font-bold md:text-5xl";
    const textShadowClass = "drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]";

    const breadcrumb = subTitle?.includes('>')
        ? subTitle.split('>').map((value) => value.trim()).filter(Boolean)
        : null;

    const gradientEnd = pathname === "/" ? "md:right-[25%]" : "md:right-[35%]";

    return (
        <header className="relative h-[320px] bg-[url('/cover_cedge.webp')] bg-cover bg-center md:h-[500px]">
            <div
                className={`pointer-events-none absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent ${gradientEnd}`}
                aria-hidden="true"
            />
            <div className="container relative z-10 mx-auto h-full px-10">
                <div className="flex h-full items-center text-white">
                    <div className="flex max-w-3xl flex-col gap-6 md:gap-8">
                        <HeadingTag className={`${headingStyles} ${textShadowClass}`}>{title}</HeadingTag>
                        {breadcrumb ? (
                            <nav aria-label="パンくずリスト">
                                <ol className={`flex items-center gap-2 text-base md:text-2xl ${textShadowClass}`}>
                                    {breadcrumb.map((item, index) => (
                                        <li key={`${item}-${index}`} className="flex items-center gap-2">
                                            <span
                                                className={`whitespace-nowrap ${index + 1 === breadcrumb.length ? 'text-orange-400' : ''}`}
                                            >
                                                {item}
                                            </span>
                                            {index + 1 !== breadcrumb.length && <span aria-hidden="true">/</span>}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        ) : (
                            subTitle && (
                                <p className={`${subTitleClass ?? "text-lg md:text-2xl"} ${textShadowClass}`}>
                                    {subTitle}
                                </p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
