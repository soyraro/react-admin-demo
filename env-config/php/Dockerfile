FROM php:5.6.30-apache

RUN apt-get update

# Install Postgre PDO
RUN apt-get install -y curl php5-curl php5-mcrypt php5-gd php5-mysql \  
    && docker-php-ext-install mbstring pdo pdo_mysql 
    
RUN a2enmod headers rewrite

RUN service apache2 restart 
