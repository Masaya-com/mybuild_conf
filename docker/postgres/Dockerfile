FROM postgres:16

# ロケール・タイムゾーン設定
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

# 初期化スクリプトを配置（コンテナ初回起動時に自動実行）
# init/ 配下の .sql / .sh ファイルをアルファベット順に実行する
COPY init/ /docker-entrypoint-initdb.d/

# カスタム PostgreSQL 設定（必要に応じてコメントアウト解除）
# COPY postgresql.conf /etc/postgresql/postgresql.conf
# CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
