# Deploying Friction AI to Vercel

Is guide ko follow karke aap apni app ko Vercel par deploy kar sakte hain.

## Step 1: GitHub par Code Push karein

1.  Apne folder mein terminal open karein.
2.  Ye commands run karein:
    ```bash
    git init
    git add .
    git commit -m "Ready for deployment"
    ```
3.  **GitHub.com** par jayein aur ek **New Repository** banayein.
4.  Wahan se commands copy karke paste karein (kuch aisa dikhega):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Vercel par Project Import karein

1.  [Vercel Dashboard](https://vercel.com/dashboard) par jayein.
2.  **Add New...** > **Project** par click karein.
3.  Apni GitHub repository select karein aur **Import** daba dein.

## Step 3: API Key Dalein (Important!)

1.  Import screen par, **Environment Variables** section kholein.
2.  Ek naya variable add karein:
    *   **Key**: `GEMINI_API_KEY`
    *   **Value**: (Apni `.env` file wali API key yahan paste karein)
3.  **Add** par click karein.

## Step 4: Deploy

1.  **Deploy** button dabayein.
2.  Thodi der wait karein. Jab confetti udega, aapki website live ho jayegi!
