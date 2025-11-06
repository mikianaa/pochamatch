バックエンドの起動
# バックエンドディレクトリに移動
cd pochamatch-backend

# Poetryで依存関係をインストール（初回のみ）
poetry install

# 開発サーバーを起動
poetry run fastapi dev app/main.py
バックエンドは http://localhost:8000 で起動します。

フロントエンドの起動
別のターミナルウィンドウで:

# フロントエンドディレクトリに移動
cd pochamatch-frontend

# 依存関係をインストール（初回のみ）
npm install

# 開発サーバーを起動
npm run dev
フロントエンドは http://localhost:5173 で起動します。

デモアカウント
以下のアカウントでログインできます:

メールアドレス: user1@example.com

パスワード: password123

他にも user2@example.com ～ user5@example.com が利用可能です（すべて同じパスワード）。

注意事項
バックエンドはインメモリデータベースを使用しているため、サーバーを再起動するとデータは失われます

フロントエンドの .env ファイルで VITE_API_URL=http://localhost:8000 が設定されていることを確認してください
