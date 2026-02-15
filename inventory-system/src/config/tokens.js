const tokenTypes = {
  ACCESS: 'access', // Token akses untuk JWT(authentication)
  REFRESH: 'refresh', // Memperbarui token yang sudah expired
  RESET_PASSWORD: 'resetPassword', // Token untuk reset (via email)
  VERIFY_EMAIL: 'verifyEmail', // Token untuk verify (via email)
};

module.exports = { tokenTypes };
