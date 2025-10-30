import Link from "next/link";
import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";

export default function NotFound() {
  return (
    <>
      <GoogleTagManager />
      <main>
        <Cover pathname="/event" headingLevel="h2" />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            <h1 className="text-2xl font-semibold text-slate-800">サイバーエッジ株式会社</h1>
            <p className="mt-4 text-slate-600">
              お探しのイベントは削除されたか、URL が変更された可能性があります。
            </p>
            <div className="mt-6">
              <Link href="/" className="text-blue-600 underline decoration-current underline-offset-4 hover:text-blue-700">
                ホームへ戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
