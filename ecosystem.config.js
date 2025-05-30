module.exports = {
  apps: [{
    name: 'nest-app',
    script: 'dist/main.js',
    env: {
      NODE_ENV: 'production',
      MONGODB_URI: 'mongodb+srv://humoyun:humoyun1908@cluster0.ov0yf8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      JWT_SECRET: '8ebcb8e98bdad9e4bb4f9b5da09a9a6ea8669ff32844136f80d248df1dd8d786a8a8cb807ba60fe37f884846468a4076d14ed2f9e781577a2f16571eb9378453',
      PORT: 3000
    }
  }]
};

