
# Sylheti Bloggers

Welcome to the Sylheti Bloggers, a vibrant space crafted especially for Sylheti speakers! This platform features an engaging mix of 10% native Sylheti and the rest in English, making it both familiar and accessible. Dive into a seamless experience where you can effortlessly create, read, update, and delete blog posts. Showcase your stories with multiple images and connect with the community through likes, comments, and reporting features.

Designed with the Sylheti community in mind, the intuitive interface makes sharing your thoughts and tales a breeze. Plus, the dedicated admin dashboard ensures smooth monitoring and content management, keeping the space safe and enjoyable for everyone.

Join us and start sharing your unique stories today!


## Features

- **Multilingual Support :** Blend of 10% native Sylheti and the rest in English.

- **User Operations:** Create, read, update, and delete blog posts.

- **Media Support:** Upload multiple images to enhance your blogs.

- **Interactive Elements:** Like, comment on, and report blogs, customized error on unwanted routing and specific error to blogs that are from users who are restricted or unpublished their blogs, and reportModal for restricted user profile visit.

- **User Authentication:** Seamless login and logout functionality(using userContextProvider).

- **Admin Dashboard:** Monitor and manage the entire platform and content with ease.

## Techincal Overview User Journey 

![User Journey Diagram](https://i.postimg.cc/XvwVGfbp/diagram-export-6-24-2024-11-07-09-PM.png)

## High-Level System Overview

![High-Level System Overview](https://i.postimg.cc/x8c9mQ6d/diagram-export-6-25-2024-2-48-02-AM.png)

## Desktop View (showing the features) - Video



https://github.com/TSRohit99/Sylheti_Bloggers/assets/112565753/889bcec4-d8cc-4688-bed8-206001bc6f97




## Mobile View - Video


https://github.com/TSRohit99/Sylheti_Bloggers/assets/112565753/171c09f6-6c1e-457d-b0dc-31083108f261




## Hosting And Cloud Storage used
- Gcloud for storage and sql database (using free version available for 90 days)
- Render.com for deploying the backend (https://sylheti-bloggers.onrender.com/)
- Vercel.com for rendering the frontend (https://sylheti-bloggers.vercel.app/)
- Netlify.com.com for rendering the frontend (https://sylheti-bloggers.netlify.app/)

## Languages & DBMS
**Frontend :** React.js, Tailwind CSS.

**Backend :** Node.js and Express framework and some other npm packages.

**DBMS :** MYSQL.


## API Reference

#### Get all blogs

```http
  GET /blogs
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| ` null` | `n/a` | It will fetch all the blogs|

#### Get single blog

```http
  GET /blogs/${bid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `bid`      | `number` | **Required**. bid of blog to fetch |

There are tons of APIs, you can find them on the ./Backend. There are no requirements of API key for now as its a beta version. User auth and API keys will be introduced later.



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_NAME`
`DB_USER`
`DB_PASS`
`DB_HOST`
`PROJECT_ID`

There's a config file called mykey.json for Gcloud in ./Backend that is not the repo. You need to add it from your Gcloud. You can google it to learn more.





## Run on your local machine

To run this on local host clone the project first

```bash
git init
git clone https://github.com/TSRohit99/Sylheti_Bloggers.git

```

### Backend Setup
Navigate to the backend directory:

```bash
cd Sylheti_Bloggers/Backend
```

Install backend dependencies:

```bash
npm install
```
Start the backend server:
```bash
npm run start
```

The backend server will run on http://localhost:8081


### Frontend Setup
Navigate to the project-ui directory:

```bash
cd Sylheti_Bloggers/project-ui
```

Install project-ui dependencies:

```bash
npm install
```
Start the frontend server:
```bash
npm run start
```

The frontend server (React + Vite) will run on http://localhost:5173


### DBMS Setup

Create tables according to this database diagram

![Database Diagram](https://i.postimg.cc/zDHX6TLj/diagram-export-6-19-2024-1-44-54-AM.png)

## Note : 
You need to change the apiPrefix from the components to localhost to use the project in your machine and prefer the Gcloud to use the backend altough I kept the multerStorage in my backend, you can use it as well to save files in your own server.

```javascript
 //const apiPrefix = 'https://sylheti-bloggers.onrender.com'
   const apiPrefix = 'http://localhost:8081'
```

## Cons
- Users have to wait after registration for login into their account until their accounts get approved by an admin. This apporach is introdcued from the eariler version as I am not using any traditional user auth as JWT.

- No keys in APIs, as its for a Uni project. I will add it in the upcoming version.

## Author

- Contact [@Rohit](https://tsrohit99.github.io) for any queries or contributions.
