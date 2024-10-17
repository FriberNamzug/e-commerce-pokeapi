# Usa la imagen oficial de PHP
FROM php:8.2-fpm

# Instala dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev

RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY . .

### Instala dependencias de Composer ###
RUN composer install

### Da permisos a las carpetas de Laravel ###
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

## Exponer el puerto 9000 para PHP-FPM
RUN composer install

EXPOSE 8000

CMD php artisan migrate && php artisan serve --host=0.0.0.0 --port=8000
