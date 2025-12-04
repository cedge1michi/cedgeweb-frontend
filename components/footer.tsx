import { serviceSite } from "@/lib/definitions";

/**
 * フッターを生成する。
 */
export default function Footer() {
    return (
        <footer className="text-white bg-gray-800">
            <div className="flex justify-center items-center py-4">
                &copy; 2020 {serviceSite.nameInEnglish}
            </div>
        </footer>
    );
}
