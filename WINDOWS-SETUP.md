# Get the code into VS Code (Windows / PowerShell)

The code is **already pushed to GitHub**. You don't need the bundle file, and you don't need
to push anything. Just pull it down.

My earlier instructions were for Mac/Linux — that's why they failed. These are PowerShell.

---

## The problem with your current folder

`C:\Users\riyad\repos\Build-Your-Dream-Car` is an **empty repo on `main`**. It has no
connection to the new branch, which is why every command failed. There's also now a nested
`Build-Your-Dream-Car\Build-Your-Dream-Car` folder from a clone that half-worked.

Easiest fix: delete both and clone fresh.

---

## Step 1 — fix npm first (one time only)

Before anything else, this error must go away:

```
npm : Impossible de charger le fichier ...\npm.ps1, car l’exécution de scripts est désactivée
```

Windows blocks scripts by default. Unblock them for your own user — open PowerShell and run:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Type `O` (oui) or `Y` and press Enter.

This is safe: it only affects your account, and `RemoteSigned` still blocks unsigned scripts
downloaded from the internet. It's the standard setting for anyone doing Node development
on Windows.

Verify:

```powershell
npm -v
```

You should get a version number like `10.9.8`.

---

## Step 2 — remove the broken folders

```powershell
cd C:\Users\riyad\repos
Remove-Item -Recurse -Force .\Build-Your-Dream-Car
```

> Careful: that deletes the folder and everything in it. Yours is empty apart from the failed
> clone, so nothing of yours is lost. If you're unsure, rename it instead:
> `Rename-Item .\Build-Your-Dream-Car Build-Your-Dream-Car-old`

---

## Step 3 — clone the branch

One line, no backslashes:

```powershell
git clone -b arena/01a07c3d-build-your-dream-car https://github.com/Riyadb023/Build-Your-Dream-Car.git
```

Then go in:

```powershell
cd Build-Your-Dream-Car
```

Check you got it:

```powershell
git log --oneline
```

You should see:

```
e45332c  Fix randomiser, sleeper detection and two impossible challenges
37d7a6f  Add animated stats, draft persistence, test runner and README
1004db1  Build the React application: builder, garage, challenges
c320e6f  Add data model, calibrated physics engine and procedural SVG car renderer
ab19972  Initial commit
```

---

## Step 4 — install and run

**PowerShell has no `&&`.** Run these as two separate commands:

```powershell
npm install
```

```powershell
npm run dev
```

Then Ctrl+click the `http://localhost:5173` link it prints.

---

## Step 5 — open in VS Code

```powershell
code .
```

(If `code` isn't recognised: in VS Code press `Ctrl+Shift+P`, type
`Shell Command: Install 'code' command in PATH`, hit Enter, then reopen PowerShell.)

Or just: **VS Code → File → Open Folder →**
`C:\Users\riyad\repos\Build-Your-Dream-Car`

---

## PowerShell vs Mac/Linux — why my commands broke

| I wrote | Why it failed | PowerShell version |
| --- | --- | --- |
| `\` at end of line | line-continuation is `` ` `` in PowerShell | put it all on one line |
| `~/Downloads/file` | `~/` isn't expanded that way | `$HOME\Downloads\file` |
| `npm install && npm run dev` | `&&` isn't a separator | run them as two commands |
| `rm -rf folder` | not a PowerShell command | `Remove-Item -Recurse -Force folder` |

---

## Making the pull request

The branch is pushed, so GitHub will offer it directly:

**https://github.com/Riyadb023/Build-Your-Dream-Car/pull/new/arena/01a07c3d-build-your-dream-car**

Or go to the repo, and click the "Compare & pull request" banner. Nothing has been merged
into `main` — that stays entirely your call.

---

## Commands worth knowing

Each on its own line, no `&&`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build into `dist\` |
| `npm test` | Lint + all four test harnesses |
| `npm run test:stats` | Physics vs real published 0–100 times |
| `npm run test:logic` | Build state, share links, personalities, challenge fairness |

---

## If it still misbehaves

**`git clone` says "authentication failed"** — the repo is private and your Git needs
credentials. Install [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager)
(it ships with Git for Windows) and a browser window will handle the login.

**`npm install` still blocked after Step 1** — you may have opened a *new* PowerShell before
the policy change took effect. Close all PowerShell windows and reopen one.

**`node` not recognised** — install Node from https://nodejs.org (LTS), then reopen
PowerShell. Check with `node -v`; you need 18 or newer.
