/**
 * カバー画像のタイトルとサブタイトルを取得する。
 * @param path ページロケーション
 * @returns タイトルとサブタイトル
 */
function getTitleInfo(path: string) {
    switch (path) {
        case '/':
            return {
                title: "Accelerating Business Development",
                subTitle: "CYBEREDGE Inc."
            };
        case '/services':
            return {
                title: "SERVICES",
                subTitle: "HOME > SERVICES"
            };
        case '/profile':
            return {
                title: "PROFILE",
                subTitle: "HOME > PROFILE"
            };
        case '/contact':
            return {
                title: "CONTACT",
                subTitle: "HOME > CONTACT"
            };
        default:
            return { title: '', subTitle: '' };
    }
}

/**
 * カバーセクションのdiv要素を生成する。
 * @param pathname ページロケーション
 * @returns カバーセクションのdiv要素
 */
export function Cover({ pathname }: Readonly<{ pathname: string; }>) {
    const { title, subTitle } = getTitleInfo(pathname);

    return (
        <div className="bg-cover bg-center h-[500px] bg-[url('/yun_10682_shinjuku_Retouch_4k.jpg')]">
            <div className="container mx-auto px-10">
                <div className="h-[500px] flex items-center text-white text-5xl font-bold">
                    <div className="flex flex-col">
                        <div className="">{title}</div>
                        <div className="mt-2">
                            {subTitle.includes('>') ? (
                                <div className="text-2xl">
                                    <span>HOME &gt; </span>
                                    <span className='text-orange-400'>{subTitle.split(' > ')[1]}</span>
                                </div>
                            ) : (
                                <span>{subTitle}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
