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
                titleClass: "text-4xl font-bold md:text-5xl",
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

    const breadcrumb = subTitle?.includes('>')
        ? subTitle.split('>').map((value) => value.trim()).filter(Boolean)
        : null;

    return (
        <header className="bg-cover bg-center h-[320px] md:h-[500px] bg-[url('/cover_cedge.webp')]">
            <div className="container mx-auto h-full px-10">
                <div className="flex h-full items-center text-white">
                    <div className="flex flex-col gap-3 md:gap-5">
                        <HeadingTag className={headingStyles}>{title}</HeadingTag>
                        {breadcrumb ? (
                            <nav aria-label="パンくずリスト">
                                <ol className="flex items-center gap-2 text-base md:text-2xl">
                                    {breadcrumb.map((item, index) => (
                                        <li key={`${item}-${index}`} className="flex items-center gap-2">
                                            <span className={index + 1 === breadcrumb.length ? 'text-orange-400' : ''}>
                                                {item}
                                            </span>
                                            {index + 1 !== breadcrumb.length && <span aria-hidden="true">/</span>}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        ) : (
                            subTitle && (
                                <p className={subTitleClass ?? "text-lg md:text-2xl"}>
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
