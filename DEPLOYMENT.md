# Deployment Instructions

## 🚀 Fixing the "read-only file system" Error

The error you're seeing (`EROFS: read-only file system`) happens because Vercel's serverless functions can't write to the local file system. We've implemented a solution using **Vercel KV** (Redis) for production storage.

## 📋 Steps to Deploy

### 1. **Add Vercel KV Database**

In your Vercel dashboard:

1. Go to your project (wearelosing.com)
2. Click on the **"Storage"** tab
3. Click **"Create Database"**
4. Select **"KV"** (Redis)
5. Choose a name like `blackbriar-kv`
6. Click **"Create"**

Vercel will automatically add these environment variables:
- `KV_URL`
- `KV_REST_API_URL` 
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 2. **Deploy the Updated Code**

The code has been updated to:
- ✅ Use Vercel KV for production storage
- ✅ Fall back to local files for development
- ✅ Handle both run submissions and comments
- ✅ Maintain all existing functionality

Simply push/deploy the current code and it will automatically use KV in production.

### 3. **Optional: Add AI API Keys**

For AI roast generation, add these environment variables in Vercel:
- `OPENAI_API_KEY` (for OpenAI)
- `ANTHROPIC_API_KEY` (for Claude)

If neither is set, the app will work fine but won't generate AI roasts.

## 🔧 How It Works

### **Production (Vercel)**
- Uses Vercel KV (Redis) for data storage
- Serverless functions can read/write to KV
- Data persists between function invocations
- Fast, scalable, and reliable

### **Development (Local)**
- Falls back to local JSON files
- No KV setup required for development
- Same API interface, different storage backend

### **Data Migration**
- Existing data in `data/runs.json` and `data/comments.json` won't be automatically migrated
- The app will start fresh with KV storage
- If you need to migrate existing data, let me know and I can create a migration script

## ✅ Expected Results

After deployment:
- ✅ Run submissions will work
- ✅ Comments will work  
- ✅ No more "read-only file system" errors
- ✅ Data will persist properly
- ✅ All existing features will work

## 🆘 If You Need Help

If you encounter any issues:
1. Check the Vercel function logs for errors
2. Verify the KV database is created and connected
3. Make sure the environment variables are set
4. Let me know if you need assistance with migration or troubleshooting

The storage system is now production-ready! 🎉
