import secrets

class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False



class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///SwiftFix.db'
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = "your_secret_salt_here"
    SECRET_KEY = secrets.token_hex(16)
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    WTF_CSRF_ENABLED = False
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'pacwynjaswanth@gmail.com'
    MAIL_PASSWORD = '**********'
    MAIL_DEFAULT_SENDER = 'pacwynjaswanth@gmail.com'

