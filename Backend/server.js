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
  var sql = "SELECT * FROM blogs WHERE published NOT IN (0) ORDER BY publishedAt DESC , bid DESC"; 
  database.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

//  <<<<<<<<< single blogs fetching >>>>>>>>
app.get("/blogs/:bid", async (req, res) => {
  const bid = req.params.bid;
  var sql = `SELECT * FROM blogs JOIN users on users.id=blogs.id WHERE bid=?`;
  const data = await new Promise((resolve, reject) => {
    database.query(sql, [bid], (err, data) => {
      if (err) {
        reject(err)
        console.log(err)
        console.log(data)
         return
      }
      else resolve(data);
    });
  });
  sql = `SELECT image FROM blogimages WHERE bid=?`;
  let images = await new Promise((resolve, reject) => {
    database.query(sql, [bid],(err, data) => {
      if (err){ reject(err)
        console.log(err)
      console.log(data)
         return
      }
      else resolve(data);
    });
  });
  const values = {
    images,
    data
  }

  res.status(200).send(values);
  
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
        const sql = `INSERT INTO likedby (bid, username) VALUES (?, ?)`;

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
        const sql = `DELETE FROM likedby where bid =? AND username =?`;
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
  // const username = req.body.email.split("@")[0];

  //complex structure, will use when there's possibilites of x@gmail.com and x@hotmail.com
  const username = req.body.email.split('@')[0] + req.body.email.charAt(req.body.email.indexOf('@') + 1).charCodeAt(0);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const sql =
    "INSERT INTO users (username, fname, joined, email, area, password, isVerified ) VALUES (?)";
  const values = [
    username,
    req.body.name,
    formattedDate,
    req.body.email,
    req.body.area,
    hashedPassword,
    0
  ];
  database.query(sql, [values], (err, data) => {
    if (err) console.log(err);
    // return res.json(data);
    res.send(data);
  });
});


app.get("/admin-dash", async (req, res) => {
  try {
    const sql1 = "SELECT count(id) AS restrictedUsers FROM users WHERE restricted = 1";
    const sql2 =
      "SELECT users.id,users.email, users.area, users.fname, users.restricted, users.isVerified, COUNT(blogs.bid) AS totalBlogs FROM users LEFT JOIN blogs ON users.id = blogs.id GROUP BY users.id, users.isVerified,users.restricted,users.area, users.fname, users.email";
    const sql3 = "SELECT COUNT(id) AS totalUsers FROM users WHERE isVerified = '1'";
    const sql4 = "SELECT COUNT(like_id) AS totalLikes FROM likedby";
    const sql5 = "SELECT COUNT(comment_id) AS totalComments FROM comments";
    const sql6 = "SELECT COUNT(bid) AS totalBlogs FROM blogs";
    const sql7 = "SELECT COUNT(bid) AS restrictedBlogs FROM blogs WHERE published= '0'";

    const [restrictedUsers,users, totalUsers, totalLikes, totalComments, totalBlogs, restrictedBlogs] = await Promise.all([
      new Promise((resolve, reject) => {
        database.query(sql1, (err, data) => {
          if (err) reject(err);
          else resolve(data[0].restrictedUsers);
        });
      }),
      new Promise((resolve, reject) => {
        database.query(sql2, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      }),
      new Promise((resolve, reject) => {
        database.query(sql3, (err, data) => {
          if (err) reject(err);
          else resolve(data[0].totalUsers);
        });
      }),
      new Promise((resolve, reject) => {
        database.query(sql4, (err, data) => {
          if (err) reject(err);
          else resolve(data[0].totalLikes);
        });
      }),
      new Promise((resolve, reject) => {
        database.query(sql5, (err, data) => {
          if (err) reject(err);
          else resolve(data[0].totalComments);
        });
      }),
      new Promise((resolve, reject) => {
        database.query(sql6, (err, data) => {
          if (err) reject(err);
          else resolve(data[0].totalBlogs);
        });
      }),
      new Promise((resolve, reject) => {
        database.query(sql7, (err, data) => {
          if (err) reject(err);
          else resolve(data[0].restrictedBlogs);
        });
      }),
    ]);

    const values = {
      users,
      totalUsers,
      totalLikes,
      totalComments,
      restrictedUsers,
      totalBlogs,
      restrictedBlogs
    };
    res.status(200).json(values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/admin-action", (req, res) => {
  const id = req.body.id;
  const status = req.body.status;

  if(status === "verified"){
    const sql = "UPDATE users SET isVerified = 1 WHERE id =?";
    database.query(sql, id, (err, data)=>{
      if(err){ 
        console.error(err)
        res.status(200).json({success : false});
      };
      res.status(200).json({success : true});
    })
  }
  else if (status === "restrict") {
    const sql = "UPDATE users SET restricted = 1 WHERE id =?";
    database.query(sql, id, (err, data)=>{
      if(err){ 
        console.error(err)
      };
    })
    const sql2= "UPDATE blogs SET published = '0' WHERE id =?"
    database.query(sql2, id, (err, data)=>{
      if(err){ 
        console.error(err)
      };
    })

    res.status(200).json({success : true});

  }
  else if (status === "unrestrict") {
    const sql = "UPDATE users SET restricted = 0 WHERE id =?";
    database.query(sql, id, (err, data)=>{
      if(err){ 
        console.error(err)
      };
    })
    const sql2= "UPDATE blogs SET published = '1' WHERE id =?"
    database.query(sql2, id, (err, data)=>{
      if(err){ 
        console.error(err)
      };
    })

    res.status(200).json({success : true});
  }
})

//<<<<< /login >>>>>>>>>
app.post("/login", (req, res) => {
  const sql =
    "SELECT users.email, users.username, users.password, users.restricted, users.isVerified, roles.role FROM users LEFT JOIN roles on users.id = roles.id WHERE email = ?";

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
       username : data[0].username ,
       isVerified : data[0].isVerified,
       restricted : data[0].restricted
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
app.post("/create", upload.array("files", 10), (req, res) => {
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
    const sql = "INSERT INTO blogs (id, author, title, content, readingTime, category, publishedAt, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [id, fname, req.body.title, req.body.content, req.body.readingTime, req.body.category, formattedDate, 1];
    database.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error creating blog:", err);
        res.status(500).send("Error creating blog");
        return;
      } else {
        const sql = "SELECT bid FROM blogs WHERE id = ? ORDER BY bid DESC LIMIT 1";
        database.query(sql, [id], (err, result) => {
          if (err) {
            console.error("Error getting bid:", err);
            res.status(500).send("Error getting bid:");
            return;
          }
          const bid = result[0].bid;
          const sql2 = "INSERT INTO blogimages (bid, image) VALUES (?, ?)";
          let errors = [];

          for (let i = 0; i < req.files.length; i++) {
            database.query(sql2, [bid, req.files[i].filename], (err, data) => {
              if (err) {
                errors.push(err);
              }
            });
          }
          const sql3 = "UPDATE blogs SET headerPictureUrl =? WHERE bid=? ";
          database.query(sql3, [req.files[0].filename, bid], (err, result) => {
            if (err) {
              console.error("Error updating headerPictureUrl:", err);
              res.status(500).send("Error updating headerPictureUrl");
              return;
            }
          })
          if (errors.length > 0) {
            console.error("Errors inserting images:", errors);
            res.status(500).send("Error inserting images");

          } else {
            const responseData = {
              message: "New blog created successfully",
              bid: bid,
            };
            res.status(200).json(responseData);
          }
        });
      }
    });
  });
});

//  <<<<<<<<< Update blogs >>>>>>>>
app.post("/update", upload.array("files", 10),(req, res) => {
  const bid = req.body.bid;

  // Check if req.file exists (i.e., a file was uploaded)
  if (req.files) {

    const sql1 = "DELETE from blogimages WHERE bid=?"
    database.query(sql1, [bid], (err, result) => {
      if (err) {
        console.error("Error deleting prev pictures:", err);
        res.status(500).send("Error deleting prev pictures");
        return;
      }
    })

    const sql2 = "INSERT INTO blogimages (bid, image) VALUES (?, ?)";
    let errors = [];

    for (let i = 0; i < req.files.length; i++) {
      database.query(sql2, [bid, req.files[i].filename], (err, data) => {
        if (err) {
          errors.push(err);
        }
      });
    }
    const sql3 = "UPDATE blogs SET headerPictureUrl =? WHERE bid=? ";
    database.query(sql3, [req.files[0].filename, bid], (err, result) => {
      if (err) {
        console.error("Error updating headerPictureUrl:", err);
        res.status(500).send("Error updating headerPictureUrl");
        return;
      }
    })
  }

 const sql =
      "UPDATE blogs SET title=?, content=?, readingTime=? , category=? WHERE bid=?";
  const  values = [
      req.body.title,
      req.body.content,
      req.body.readingTime,
      req.body.category,
      bid,
    ];

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