### forum-express-grading

# Restaurant Forum

Restaurant Forum is an interactive online platform for users to share their favorite restaurants.

You can also interact with its online version at: https://restaurant-forum-chiaan.herokuapp.com/

## About the Webpage
1. Click on the restaurant to see its description.
2. Leave comments and view what others say about this restaurant. 
3. As an admin, you can edit restaurants, delete comments, and edit other users' status. 

---

## Installation

You can clone this project from here: [github link](https://github.com/CHIA-AN-YANG/forum-express-grading.git)
### 1. Web app installation
Clone with HTTPs:

```bash
git clone https://github.com/CHIA-AN-YANG/forum-express-grading.git
```
Alternatively, clone with SSH:
```bash
git clone git@github.com:CHIA-AN-YANG/forum-express-grading.git
```
Run npm install to install required plugins.

```bash
npm install
```
### 2. Database installation
1. This work uses MySQL to store data. You can also use its GUI interface **Workbench**

### 3. Set up environmental variables
Please refer `env.example files: `env.example` to set up environmental variables.

---

## Usage
The npm used in this project is **6.14.13**. This project is built under **Node.js v14.17.1** runtime environment, with Express framework.

### 1. Start
To start it on local server, simply run the app.js file with `node` command in CLI:

```bash
node app.js
```
If you wish to automatically restarting the node application when file changes in the directory are detected, you may run nodemon.
Since the nodemon is intalled under project folder, it takes npx to run nodemon:

```bash
npx nodemon
```
or you can also use the script:
```bash
npm run dev
```
Now, enter http://localhost:3000/ in your browser and you are good to go!

### 2. Seeding
This is the script for seeding, please use sequelize to seed:
```
npx sequelize db:seed:all
```
To view sample data on app, please log in with the following account after seeding:

> - name:      User1
> - email:     user1@example.com
> - password:  12345678

> - name:      User2
> - email:     user2@example.com
> - password:  12345678

> - name:      root
> - email:     root@example.com
> - password:  12345678
> - **root is an admin user by default**
---

## Contributing
Drop me a line or email if you have any suggestions for improvement! My email address is: chiaan.y.creativeworker@gmail.com
