import { useTranslations } from 'next-intl';
import Header from "@/components/Header";

export default function PrivacyPage() {
    return (
        <div className="bg-[#0A0A0B] min-h-screen pt-36 pb-20 text-slate-300">
            <Header theme="dark" />
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 font-exo border-b border-white/10 pb-8">プライバシーポリシー</h1>

                <div className="space-y-8 text-sm leading-relaxed">
                    <p className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200">
                        【重要】「[運営者名]」と「[GoogleフォームのURL]」の部分を、正式な情報に書き換えてください。
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. 個人情報の利用目的</h2>
                        <p>
                            当サイトでは、お問い合わせや記事へのコメントの際、名前やメールアドレス等の個人情報を入力いただく場合がございます。
                            取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、これらの目的以外では利用いたしません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. 広告について</h2>
                        <p>
                            当サイトでは、第三者配信の広告サービス（Googleアドセンス、A8.net、Amazonアソシエイト等）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。
                            クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。
                        </p>
                        <p className="mt-4">
                            また、当サイトはAmazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. アクセス解析ツールについて</h2>
                        <p>
                            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
                            このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。
                            このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. 免責事項</h2>
                        <p>
                            当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。
                            また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。
                            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. お問い合わせ</h2>
                        <p>
                            本ポリシーに関するお問い合わせは、以下のGoogleフォームよりお願いいたします。<br />
                            <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">[GoogleフォームのURL]</a>
                        </p>
                    </section>

                    <section className="border-t border-white/10 pt-8 mt-8">
                        <p>運営者： [運営者名]</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
