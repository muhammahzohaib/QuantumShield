# Dependency Security Audit
Run before deployment:
  npm audit
  npm audit fix
  
Pinned safe versions used:
  express: 4.18.x
  multer: 1.4.5-lts.1
  helmet: 7.x
  
Auto-scan with: npx snyk test
