import { useTranslations } from 'next-intl';
import Header from "@/components/Header";

export default function TermsPage() {
    return (
        <div className="bg-[#0A0A0B] min-h-screen pt-36 pb-20 text-slate-300">
            <Header theme="dark" />
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 font-exo border-b border-white/10 pb-8">利用規約</h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <p className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200">
                        【重要】「[運営者名]」の部分を、正式な情報に書き換えてください。
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. 規約の適用</h2>
                        <p>
                            本規約は、[運営者名]（以下、「運営者」とします）が提供する「SABAI ALIGN」（以下、「当サイト」とします）の利用条件を定めるものです。
                            利用者の皆様には、本規約に従って当サイトをご利用いただきます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. サービスの提供</h2>
                        <p>
                            当サイトは現在、原則として無料で情報提供および診断機能を提供しておりますが、将来的に一部サービスを有料化する可能性がございます。その際は別途、利用規約の改定またはガイドラインの提示を行います。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. 広告・アフィリエイトについて</h2>
                        <p>
                            当サイトでは、アフィリエイトプログラムにより商品をご紹介致しております。アフィリエイトプログラムとは、商品及びサービスの提供元と業務提携を 結び商品やサービスを紹介するインターネット上のシステムです。
                            したがって、当サイトで紹介している商品は当サイトが販売している訳ではありません。
                        </p>
                        <p className="mt-2">
                            お客様ご要望の商品、お支払い等はリンク先の販売店と直接のお取引となりますので、特定商取引法に基づく表記につきましてはリンク先をご確認頂けますようお願い致します。
                            商品の価格 商品の詳細 消費税 送料 在庫数等の詳細は時として変わる場合も御座います。
                            また、返品・返金保証に関しましてもリンク先の販売店が保証するものです。当サイトだけではなくリンク 先のサイトも良くご確認頂けますようお願い致します。
                            当サイトの掲載情報をご利用頂く場合には、お客様のご判断と責任におきましてご利用頂けますようお願い致します。当サイトでは、一切の責任を負いかねます事ご了承願います。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. 禁止事項</h2>
                        <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>当サイトのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
                            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                            <li>不正アクセスをし、またはこれを試みる行為</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. 免責事項</h2>
                        <p>
                            運営者は、本サービスの利用により利用者に生じたあらゆる損害について、一切の責任を負いません。
                            また、当サイトからリンクされた第三者のサイトにおけるトラブル等についても責任を負いかねます。
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
