# Lab: Who's there? 
<img src="./public/main.png" width=400 />

## Cookie-Based Auth

## Introduction

Last lab you built the DevForge backend. It signs users up, logs them in, and
when it does, it hands back an auth token tucked inside an **httpOnly cookie**.
That part already works. The problem is the frontend has no idea any of it
exists. Right now the login screen is a pretty face wired to nothing useful: it
fires off a request, dumps a token into `localStorage`, and shrugs.

This lab is about a skill you will use on basically every real app you ever
build: **wiring a React frontend to a cookie-authenticated API, and giving the
whole app a single source of truth for "who is logged in" using context, a
provider, and a hook.**

By the end, your app will log a user in, ask the backend "okay, so who am I?",
and remember the answer everywhere, without ever touching `localStorage`.

## The situation

You are back on the DevForge team. Your tech lead drops by your desk:

> "Backend's solid, you are already done with that, the cookie gets set, I trust you. But the frontend
> is a mess. Whoever wrote that auth form was clearly mid-tutorial: hardcoded
> URLs everywhere, and they're shoving the token into `localStorage`. Please, clean that
> up. Then I want the app to actually know who's logged in, properly, with a
> context so any component can ask. And for Uncle Bobs' sake: I do NOT want that token
> living in `localStorage` where any random script on the page can read it. Let
> the cookie do its job."

The token should stay in an httpOnly cookie the browser sends automatically, and your JavaScript never sees
it. You prove who you are by asking the backend, not by reading a token yourself.

## The backend you already have

It is the API you built in the previous lab. Have it running before you start,
on its own port (the starter assumes something like `http://localhost:5000/auth`).

It does three things you care about here: it signs a user up, it logs a user in
(setting the httpOnly cookie on the way), and it has a "who am I" route that
reads that cookie and tells you about the current user.

⚠️ One trap worth flagging now: the URLs already written into
`app/auth/AuthForm.js` were written for an **older** version of this backend.
Resist the urge to trust the strings that are already in the file.

## What you will build

- A cleanup pass on `app/auth/AuthForm.js`: no more hardcoded base URL, no more `localStorage`.
- An auth **context**, a **provider**, and a **hook** (`useAuth`), following today's lesson.
- A call to the backend's "who am I" route after login and signup, so you actually fetch the user.
- The logged-in user stored in context, so any component in the app can read it.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will see the DevForge
landing page. The "Log in" button takes you to `/auth`, where the form lives. It
already renders and validates, and it already tries to talk to the backend, it
just does it in all the wrong ways. Make sure your backend from the previous lab
is running too, or every request will fail.

## Your job

Work in this order. Each step should leave the app in a working state before you
move on.

### 1. Clean up the API calls

Open `app/auth/AuthForm.js`. The base URL is hardcoded in two places. Pull it
out into an environment variable (something like `NEXT_PUBLIC_API_URL`) so the
host and port live in exactly one place, and reference that everywhere you fetch.

While you are in there, confirm the **route paths** against your actual backend
(see the trap above). Fix them if they are wrong.

### 2. Stop hoarding the token

Find the line that does `localStorage.setItem("token", ...)` and delete it. You
do not need it, and you do not want it. The token is in the httpOnly cookie now.

To make that cookie actually flow, add `credentials: "include"` to every `fetch`
call (login, signup, and the "who am I" request you are about to add). Without
it, the browser will not store the cookie the backend sets, and it will not send
it back on later requests.

### 3. Create the context, the provider, and the hook

This is the core of today's lesson. Follow the steps from the portal to build:

- an **auth context** that holds the current user (and probably a loading flag),
- an **auth provider** component that owns that state and exposes login / signup / logout helpers,
- a **`useAuth` hook** so any component can read the user without prop-drilling.

I am deliberately not pasting the code here. The lesson walks you through the
shape of it. Build it, do not copy it blind **do NOT use AI** to build it. This process must be understood, not reverse-engineered from a snippet.

### 4. Wrap the app in the provider

A context is useless if nothing is inside it. Wrap your app in the provider
(`app/layout.js` is the natural home) so every page and component can call
`useAuth`. 
What happens if that is a server component? You will find out, and you will fix it, right? 😅

### 5. Ask the backend "who am I?"

After a successful login or signup, call the backend's "who am I" route (with
`credentials: "include"`, so the cookie rides along). Take the user it returns
and store it in your context.

This is the moment the whole design pays off: you never read the token. You hand
the browser's cookie to the backend, the backend verifies it over HTTP, and it
tells you who you are. That is what "verifying the token with HTTP" means, and it
is why an attacker who can run a script on your page still cannot steal the
token.


## 6. Styling

This step is crutial for the user experience. 
As you know the initial styles are less than ideal. 

We need to improve the styling of the login and signup forms, as well as the overall look and feel of the app.
Send a screen capture on slack if you do, so we can all enjoy it and **vote for the best one**.

## Checklist before you call it done

✅ The backend base URL is read from an environment variable, not hardcoded.

✅ The route paths in `AuthForm.js` match your actual backend.

✅ Every fetch that needs the cookie uses `credentials: "include"`.

✅ Nothing writes the token to `localStorage` (check the Application tab, it should not be there).

✅ There is an auth context, a provider, and a `useAuth` hook.

✅ The provider wraps the whole app.

✅ After logging in or signing up, the app calls the "who am I" route and stores the returned user in context.

✅ A component can read the logged-in user through `useAuth`.

✅ No errors in the browser console.

## If you finish early

- Add a **logout** that asks the backend to clear the cookie, then resets the user in context.
- Redirections: if you login or signup successfully, redirect to `/`. If you log out, redirect to `/auth`.
- **Protect a route**: Create a new page that only logged-in users can see. If a non-logged-in user tries to visit it, redirect them to `/auth`. We haven't seen that in class yet, but I'm sure you'll figure it out. 
- Show the logged-in user's handle somewhere in the UI (the navbar on the landing page is a good spot) so you can see the context working at a glance.

## Key concepts to review

- [React Context](https://react.dev/reference/react/createContext)
- [Custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [`fetch` credentials / sending cookies](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#credentials)
- [httpOnly cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [CORS with credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)

## Delivering the lab

Work in groups of two or three. Everyone opens a PR on their own fork and shares
the link in the students portal.
