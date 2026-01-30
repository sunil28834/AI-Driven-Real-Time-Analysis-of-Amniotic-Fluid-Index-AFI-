# Install Local MongoDB - Quick Setup

## Step 1: Download MongoDB

Download MongoDB Community Server:
https://www.mongodb.com/try/download/community

- Select: Windows
- Version: Latest (7.0 or higher)
- Package: MSI

## Step 2: Install

1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **IMPORTANT**: Check "Install MongoDB as a Service" 
4. Click "Next" through all steps
5. Click "Install"

MongoDB will automatically start running on `localhost:27017`

## Step 3: Update Your .env File

Open: `backend\.env`

Change this line:
```
MONGO_URL=mongodb+srv://rsrihari:rsrihari@cluster0.1tbv4jw.mongodb.net/?retryWrites=true&w=majority
```

To this:
```
MONGO_URL=mongodb://localhost:27017
```

## Step 4: Restart Your Server

Press CTRL+C to stop the server, then:
```powershell
uvicorn app.main:app --reload --port 8000
```

You should see:
```
✅ Connected to MongoDB
INFO:     Application startup complete.
```

## Done! 🎉

Your app will now work with local MongoDB. No more SSL errors!

## Alternative: Quick Fix Without Installing

If you don't want to install MongoDB, just update `.env`:

```
MONGO_URL=mongodb://localhost:27017
```

The app will start and show "Database connection unavailable" but won't crash.
You can still test the frontend UI without database functionality.
