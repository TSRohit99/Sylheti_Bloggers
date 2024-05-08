const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const database = require("./dbConnect");
const path = require("path");
const bcrypt = require("bcryptjs");

const port = 8081;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend of Sylheti Bloggers");
});

// <<<<<<<<<<< api for all blogs >>>>>>>>>>>>

app.get("/blogs", (req, res) => {
  var sql = "SELECT * FROM blogs ORDER BY publishedAt DESC , bid DESC";
  database.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

//  <<<<<<<<< single blogs fetching >>>>>>>>
app.get("/blogs/:bid", (req, res) => {
  const bid = req.params.bid;
  var sql = `SELECT * FROM blogs JOIN users on users.id=blogs.id WHERE bid=?`;
  database.query(sql, [bid], (err, result) => {
    if (err) throw err;
    res.send(result); // results is an array so we have to use 0th index
  });
});

// <<<<<<<<<<<Delete Blog>>>>>>>>>>
app.post("/delete", (req, res) => {
  const bid = req.query.bid;
  var sql = `DELETE FROM blogs WHERE bid=?`;
  database.query(sql, [bid], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ success: false });
      return;
    }
    if (result.affectedRows > 0) {
      res.status(200).send({ success: true });
    } else {
      res.status(404).send({ success: false, message: "Blog not found" });
    }
  });
});

// <<<<<<<<<< api for checking emails >>>>>>>>>>>
app.get("/checker/:email", (req, res) => {
  const email = req.params.email;
  const csql = `SELECT email FROM users WHERE email = ?`;
  database.query(csql, [email], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (data.length === 0) {
      // If no data is returned, the email doesn't exist in the database
      res.send("0");
    } else {
      // If data is returned, the email exists in the database
      res.send("1");
    }
  });
});

//<<<<<<< Blog Like Dislike Data >>>>>>>

app.get("/info/:bid/", async (req, res) => {
  const bid = req.params.bid;
  try {
    const likedData = await new Promise((resolve, reject) => {
      const sql = `select count(bid) as likeCount from likedBy where bid=?`;
      database.query(sql, [bid], (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data[0].likeCount);
      });
    });

    const likeCount = likedData;

    const dislikedData = await new Promise((resolve, reject) => {
      const sql = `select count(bid) as dislikeCount from dislikedBy where bid=?`;
      database.query(sql, [bid], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data[0].dislikeCount);
      });
    });

    const dislikeCount = dislikedData;

    const info = {
      likeCount,
      dislikeCount,
    };

    res.send(info);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//<<<<<<< Check if user already liked this blog? >>>>>

app.get("/checker/:bid/:username", async (req, res) => {
  const bid = req.params.bid;
  const username = req.params.username;

  try {
    const likedData = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM likedBy WHERE bid=? AND username=?`;
      database.query(sql, [bid, username], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

    const likedAlready = likedData.length > 0;
    const dislikedData = await new Promise((resolve, reject) => {
      const sql = `SELECT * FROM dislikedBy WHERE bid=? AND username=?`;
      database.query(sql, [bid, username], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

    const dislikedAlready = dislikedData.length > 0;

    const info = {
      likedAlready,
      dislikedAlready,
    };

    res.send(info);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//fetch like/dislike/comments
app.post("/likedislike", async (req, res) => {
  const bid = req.body.bid;
  const username = req.body.username;
  const x = req.body.x;

  try {
    if (x === "like") {
      const likedData = await new Promise((resolve, reject) => {
        const sql = `INSERT INTO likedBy (bid, username) VALUES (?, ?)`;

        database.query(sql, [bid, username], (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        });
      });
    } else if (x === "dislike") {
      const dislikedData = await new Promise((resolve, reject) => {
        const sql = `INSERT INTO dislikedBy (bid,username) VALUES (?,?)`;
        database.query(sql, [bid, username], (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        });
      });
    }

    res.send("success!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/comments/:bid", async (req, res) => {
  const bid = req.params.bid;

  try {
    const comments = await new Promise((resolve, reject) => {
      const sql = `SELECT comment_id, author, comment_text FROM comments WHERE bid=?`;

      database.query(sql, [bid], (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    res.send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//<<<<< /signup >>>>>>>>>
app.post("/signup", async (req, res) => {
  const username = req.body.email.split("@")[0];

  //complex structure, will use when there's possibilites of x@gmail.com and x@hotmail.com
  //const username = req.body.email.split('@')[0] + req.body.email.charAt(req.body.email.indexOf('@') + 1).charCodeAt(0);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const sql =
    "INSERT INTO users (username, fname, joined, email, area, password ) VALUES (?)";
  const values = [
    username,
    req.body.name,
    formattedDate,
    req.body.email,
    req.body.area,
    hashedPassword,
  ];
  database.query(sql, [values], (err, data) => {
    if (err) console.log(err);
    // return res.json(data);
    res.send(data);
  });
});

//<<<<< /login >>>>>>>>>
app.post("/login", (req, res) => {
  const sql =
    "SELECT users.email, users.username, users.password, roles.role FROM users LEFT JOIN roles on users.id = roles.id WHERE email = ?";

  database.query(sql, [req.body.email], async (err, data) => {
    if (err) throw err;

    // return res.json(data);
    // res.json(data);
    const admin = data[0].role === "admin";
    const hashedPassword = data[0].password;
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      hashedPassword
    );

    if(passwordMatch){
    res.status(200).json({
       success: true , 
       isAdmin: admin,
       username : data[0].username  
     });}
     else {
      res.status(200).json(
        "User not found!"
      )
     }

  });
});

//  <<<<<<<<< single blogs fetching >>>>>>>>
app.get("/profile/:username", (req, res) => {
  const username = req.params.username;
  var sql = `SELECT users.username, users.fname, users.joined, users.area, users.bio, users.pfpURL, blogs.title, blogs.publishedAt , blogs.bid, users.id, blogs.bid
  FROM users 
  LEFT JOIN blogs ON users.id = blogs.id 
  WHERE users.username = ?
  `;
  database.query(sql, [username], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//,,,,,,,,,Update Profile...........

app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images"); // corrected cb function call
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    ); // corrected cb function call
  },
});

const upload = multer({ storage: storage });

app.post("/update/profile", upload.single("file"), (req, res) => {
  const username = req.body.username;
  let sql, values;

  // Check if req.file exists (i.e., a file was uploaded)
  if (req.file) {
    sql = "UPDATE users SET pfpURL=?, fname=?, bio=?, area=? WHERE username=?";
    values = [
      req.file.filename,
      req.body.fullName,
      req.body.bio,
      req.body.from,
      username,
    ];
  } else {
    sql = "UPDATE users SET fname=?, bio=?, area=? WHERE username=?";
    values = [req.body.fullName, req.body.bio, req.body.from, username];
  }


  database.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ error: "Error updating profile" });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

//........Create Blogs..............//
app.post("/create", upload.single("file"), (req, res) => {
  const username = req.body.username;
  const sql0 = "SELECT id, fname FROM users WHERE username = ?";

  database.query(sql0, [username], (err, result) => {
    if (err) {
      console.error("Error getting user profile:", err);
      res.status(500).send("Error getting user profile");
      return;
    }

    if (result.length === 0) {
      console.error("User not found for username:", username);
      res.status(404).send("User not found");
      return;
    }

    const id = result[0].id;
    const fname = result[0].fname;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const sql =
      "INSERT INTO blogs (headerPictureUrl, id, author, title, content, readingTime, category, publishedAt ) VALUES (?)";
    const values = [
      req.file.filename,
      id,
      fname,
      req.body.title,
      req.body.content,
      req.body.readingTime,
      req.body.category,
      formattedDate,
    ];

    database.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error creating blog:", err);
        res.status(500).send("Error creating blog");
        return;
      } else {
        const sql =
          "SELECT bid FROM blogs WHERE id = ? ORDER BY bid DESC LIMIT 1";
        database.query(sql, [id], (err, result) => {
          if (err) {
            console.error("Error getting bid:", err);
            res.status(500).send("Error getting bid:");
            return;
          }
          const responseData = {
            message: "New blog created successfully",
            bid: result[0].bid,
          };
          res.status(200).json(responseData);
        });
      }
    });
  });
});

//  <<<<<<<<< Update blogs >>>>>>>>
app.post("/update", upload.single("file"), (req, res) => {
  const bid = req.body.bid;
  let sql, values;

  // Check if req.file exists (i.e., a file was uploaded)
  if (req.file) {
    sql =
      "UPDATE blogs SET headerPictureUrl=?, title=?, content=?, readingTime=? , category=? WHERE bid=?";
    values = [
      req.file.filename,
      req.body.title,
      req.body.content,
      req.body.readingTime,
      req.body.category,
      bid,
    ];
  } else {
    sql =
      "UPDATE blogs SET title=?, content=?, readingTime=? , category=? WHERE bid=?";
    values = [
      req.body.title,
      req.body.content,
      req.body.readingTime,
      req.body.category,
      bid,
    ];
  }

  database.query(sql, values, (error, results) => {
    if (error) {
      console.error("Error updating Blog:", error);
      res.status(500).json({ error: "Error updating Blog" });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

app.post("/addcomment", upload.none(), (req, res) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const sql = "INSERT INTO comments SET ?";
  const commentData = {
    bid: req.body.bid,
    author: req.body.author,
    comment_text: req.body.comment_text,
    created_at: formattedDate,
  };

  database.query(sql, commentData, (error, results) => {
    if (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Error adding comment" });
    } else {
      return res.status(200).json({ success: true });
    }
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
  database.connect((err) => {
    if (err) throw err;
    console.log("Database Connected!");
  });
});
