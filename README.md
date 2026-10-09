# ひらがな 書き方動画

ひらがな46文字の書き方動画を五十音順に並べた学習用ページです。文字を選ぶとYouTubeの埋め込み動画が繰り返し再生されます。各文字のQRコードは、教材内の該当文字を直接開きます。印刷ボタンでQRコード一覧を印刷できます。

## 出典・制作

- 動画: 松本松栄堂 書道教室「[ひらがなの書き方](https://matsumotoshoeido-shodo.jp/blog_category/hiragana/)」（湯淺光峰氏）
- 教材の企画・編集: 江崎哲也（esaKITs）
- 動画とサムネイルはYouTubeから表示し、このリポジトリには収録していません。各文字のリンクは `videos.json` に記載しています。

## 現在のQRコードについて

現在の46個のQRコードは、https://hiragana-writing-videos.esakit.chatgpt.site/ の該当文字URL（`?kana=あ` など）を指しています。このZIPではQRコードを変更していません。GitHub Pages公開後、最終公開URLが確定したら、そのURLを使って46個すべてを再生成する予定です。

## GitHub Pagesでの公開

このZIPの公開用ファイルはリポジトリのルートに配置する構成です。GitHubの **Settings → Pages → Deploy from a branch → main → /(root)** を選びます。`index.html`、`app.js`、`style.css`、`videos.json`、`qr/` を一緒に配置してください。サーバー側のプログラムやAPIキーは不要です。

ページには利用者の入力や学習記録を保存する機能はありません。外部のYouTube動画が削除・非公開にされた場合、その文字の再生はできなくなります。

フォントの読み込みにはGoogle Fontsを使用しています。YouTubeとGoogle Fontsの利用にはインターネット接続が必要です。
