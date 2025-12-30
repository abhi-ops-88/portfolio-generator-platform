# Move Project Instructions

## 🚀 Automated Move (Recommended)

### Option 1: Using Batch File (Windows)
```cmd
move-project.bat
```

### Option 2: Using PowerShell
```powershell
.\move-project.ps1
```

## 📁 Manual Move Instructions

If you prefer to move files manually:

### 1. Create Destination Folder
```cmd
mkdir "C:\Users\Admin\Desktop\AI\Kiro\portfolio\portfolio-generator-platform\portfolio-generator-platform"
```

### 2. Copy These Files and Folders

**Root Files:**
- `package.json`
- `vercel.json`
- `.env.example`
- `README.md`
- `DEPLOYMENT_GUIDE.md`
- `FIREBASE_SETUP.md`
- `FIREBASE_QUICK_SETUP.md`
- `VERCEL_DEPLOYMENT.md`
- `PROJECT_STRUCTURE.md`
- `deploy.sh`
- `deploy.bat`

**Folders (copy entire folders):**
- `public/`
- `src/`
- `api/`
- `server/`

### 3. Navigate to New Location
```cmd
cd "C:\Users\Admin\Desktop\AI\Kiro\portfolio\portfolio-generator-platform\portfolio-generator-platform"
```

### 4. Install Dependencies
```cmd
npm install
```

### 5. Set Up Environment
```cmd
copy .env.example .env
```

## ✅ Verification

After moving, your folder should contain:
```
portfolio-generator-platform/
├── api/
├── public/
├── server/
├── src/
├── package.json
├── vercel.json
├── README.md
└── (other files)
```

## 🚀 Next Steps

1. **Configure Firebase** (see `FIREBASE_QUICK_SETUP.md`)
2. **Deploy to Vercel** (run `deploy.bat`)
3. **Test the application**

## 🆘 If Something Goes Wrong

1. **Check file permissions**
2. **Run as Administrator** if needed
3. **Manually copy files** if scripts fail
4. **Verify all files copied** using the verification list above