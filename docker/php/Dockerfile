FROM rockylinux:9

# EPELおよびRemiリポジトリを追加してPHP 8.4を有効化
RUN dnf install -y epel-release \
    && dnf install -y https://rpms.remirepo.net/enterprise/remi-release-9.rpm \
    && dnf module reset php -y \
    && dnf module enable php:remi-8.4 -y

# Apache + PHP + 必要パッケージをインストール
RUN dnf install -y --allowerasing \
    httpd \
    php \
    php-cli \
    php-common \
    php-bcmath \
    php-intl \
    php-pdo \
    php-pgsql \
    php-zip \
    php-mbstring \
    php-xml \
    php-opcache \
    systemd \
    unzip \
    vim \
    curl \
    git \
    findutils \
    procps-ng \
    && dnf clean all \
    && rm -rf /var/cache/dnf

# デフォルトのウェルカムページを無効化
RUN rm -f /etc/httpd/conf.d/welcome.conf

# 一時ディレクトリの作成・パーミッション設定
RUN mkdir -p /tmp/sessions \
    && chmod 1777 /tmp \
    && chmod 777 /tmp/sessions

# カスタム Apache 設定をコピー
COPY 000-default.conf /etc/httpd/conf.d/mybuild.conf

# NVM + Node.js インストール
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=20.20.2

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && nvm alias default $NODE_VERSION

# node / npm を PATH に追加
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Composer インストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# コンテナログイン時のパス指定
WORKDIR /var/www/html

CMD ["/usr/sbin/init"]
