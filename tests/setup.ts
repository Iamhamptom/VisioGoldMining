// Test setup — configure environment for testing
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long!!';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'visiogold_dev';
process.env.DB_ADMIN_USER = 'visiogold_admin';
process.env.DB_ADMIN_PASSWORD = 'admin_password';
process.env.DB_APP_USER = 'visiogold_app';
process.env.DB_APP_PASSWORD = 'app_password';
