FROM php:8.4-apache

# カスタム Apache 設定をコピー
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

# パッケージインストール
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libzip-dev \
    libpq-dev \
    zlib1g-dev \
    unzip \
    locales \
    vim \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Apache の rewrite_module を有効化
RUN a2enmod rewrite

# PHP のエクステンションをインストール
RUN docker-php-ext-install \
    intl \
    pdo_pgsql \
    pgsql \
    zip

# NVM + Node.js インストール
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 20.20.2

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && nvm alias default $NODE_VERSION

# node / npm を PATH に追加
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Composer インストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# コンテナログイン時のパス指定
WORKDIR /var/www/html
