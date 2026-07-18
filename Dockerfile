FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    composer \
    nodejs \
    npm \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip

RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install -j$(nproc) gd pdo pdo_mysql bcmath

WORKDIR /app

CMD ["php-fpm"]