Topic: Party Room Platform

Steps

WireFrame and ERD
TS project Setup - folders & files 2. 1 - Front End:
Public Folder:
index.html(landing page for user),
business.html(for business user)
index.css,
index.js (AJAX)
assets folder: simulate uploading the image by business user.
404 not found handling: 404.html
投票用 html 2. 2 - server related:
server.ts,
authRoutes,
userRoutes,
商戶 Routes,
model.ts (declare the type)
formidable.ts (file uploading handling)
hash.ts (hashed password)
index.js (for run TS file) 2. 3 - uploads(folder): save the image uploaded by user/商戶. 2. 4 - env: login information for database (put in .gitignore)
env.example: delete information of username & password.
npm related library:
3.1 Typescript:

1. npm init,
2. npm install -D ts-node typescript @types/node
3. npx tsc --init

Express & Express-session
npm install express express-session
npm install -D @types/express @types/express-session

Nodemon: npm install -D nodemon (add “dev”: “ts-node-dev server.ts” package.json)
Jsonfile:
npm install jsonfile
npm install -D @types/jsonfile
Formidable:
npm install formidable
npm install -D @types/formidable

Express setup
Logger (WSP008)
Serve static folder (開 public folder 裝住 html, css, js)
Test Express
Insomnia
Create Database and Tables
database = PartyRoom
tables
users
partyroom_owners
rooms
bookings
user_comments
Connect DB (dbClient)
npm i pg dotenv
npm i -D @types/pg
const dbClient = new pg.Client({...})
Import dummy data
authRoutes
POST - Login (user)
POST - Login (商戶)
userRoutes
GET - all rooms
search/filter party rooms
compare party rooms
GET - all party room bookings
POST - submit party room booking
PUT - edit party room booking
DELETE - cancel party room booking
POST - party room review/comments
chatbox (socket.io)
vote with friend
商戶 Routes (ownerRoutes)
POST - Add party rooms (Add Pokemon to the team)
PUT - Update party room
DELETE - Delete party room
Frontend

Pages
Login Page
User Landing Page
商戶 landing page

Database
users

Column
Type
PK
id
Serial

username
VARCHAR NOT NULL

password
VARCHAR NOT NULL

partyroom_owner (商戶)
PK
id
Serial

username
VARCHAR

password
VARCHAR

partyrooms
PK
id
Serial

name
VARCHAR

price
INT NOT NULL

place
VARCHAR NOT NULL

風格
VARCHAR

設備
VARCHAR

面積
INT

容納人數
INT

簡介
TEXT

bookings

Column
Type
PK
id
Serial
FK
user_id
INT
FK
partyroom_owner_id
INT

日期
DATE NOT NULL

人數
INT NOT NULL

user 聯絡電話
INT NOT NULL

特別要求
TEXT

user_comments
PK
id
Serial
FK
user_id
INT
FK
partyroom_owner_id
INT
FK
user_partyroom_id
INT

rating
INT NOT NULL

comments
TEXT

注意
比錢過程
商戶同 users 簡時間操作
