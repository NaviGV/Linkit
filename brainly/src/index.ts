import express, { Request as ExpressRequest, Response as ExpressResponse } from "express"; 
import cors from "cors";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";

import { random } from "./utils";
import { z } from "zod";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

const JWT_PASSWORD=process.env.JWT_PASSWORD;

const app = express();
app.use(express.json());



app.use(cors({
  
}));


const signupSchema = z.object({
  username: z.string().min(3,).max(30),
  password: z.string()
    .min(8, )
    .regex(/[A-Z]/, )
    .regex(/[a-z]/, )
    .regex(/[0-9]/, )
    .regex(/[^A-Za-z0-9]/, ),
});

const signinSchema = z.object({
  username: z.string().min(1,), 
  password: z.string().min(1, ),
});



app.post("/api/v1/signup", async (req: ExpressRequest, res: ExpressResponse):Promise<void> =>{
 
  try {

    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Invalid input data",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { username, password: plainTextPassword } = validationResult.data;

 // 2. Check if user already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "Username already exists." }); 
      return;
    }

    // 3. Hash the password
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

     // Actually create the user
    await UserModel.create({
        username: username,
        password: hashedPassword,
    });

     res.status(201).json({
      message: "User signed up successfully. Please sign in.",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Invalid input data",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { username, password: plainTextPassword } = validationResult.data;

    const user = await UserModel.findOne({ username }).select('+password');

    if (!user) {
      res.status(403).json({ message: "Incorrect username or password." });
      return;
    }

   
    if (!user.password) {
        console.error(`User ${username} fetched but password field is missing, even after select('+password'). Check schema.`);
        res.status(500).json({ message: "Internal server error processing user data." });
        return;
    }

    const isPasswordMatch = await bcrypt.compare(plainTextPassword, user.password);
    if (!isPasswordMatch) {
      res.status(403).json({ message: "Incorrect username or password." });
      return;
    }

    
    if (typeof JWT_PASSWORD !== 'string' || JWT_PASSWORD.length === 0) {
      console.error("FATAL ERROR: JWT_SECRET (JWT_PASSWORD) is not defined or is empty in the environment.");
      res.status(500).json({ message: "Internal server configuration error." });
      return;
    }
   

   
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_PASSWORD, 
      { expiresIn: "1h" }
    );

    res.json({
      message: "Sign in successful!",
      token,
    });
  } catch (e: any) {
    console.error("Signin Error:", e);
    res.status(500).json({
      message: "An internal server error occurred during signin.",
      error: e.message
    });
    return;
  }
});


app.post("/api/v1/content", userMiddleware, async (req, res) => {
 
  try {
    const { link, title, type } = req.body;
   
   

    if (type === undefined) {
        console.error("ROUTE HANDLER - 'type' is undefined in req.body!");
       
    }

    const dataToCreate = {
      link,
      title,
      type,
      userId: req.userId,
      tags: [],
    };

    
    const content = await ContentModel.create(dataToCreate);

    res.status(201).json({
      message: "Content added",
      contentId: content._id 
    });
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error});
  }
});



app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId,
  });

  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    const existingLink = await LinkModel.findOne({
        userId : req.userId
    });
    if(existingLink){
        res.json({
            hash:"/share/" + existingLink.hash
        })
        return;
    }

    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash :hash
    });

    
    res.json({
     hash: "/share/" + hash 
  });
  return;

  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });
  }

  res.json({
    message: "removed sharable link",
  });
  return;
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    
    const hash = req.params.shareLink;

    const Link = await LinkModel.findOne({
        hash
    });

    if (!Link){
        res.status(411).json({
            message :"Sorry incorrect input"
        })
        return;
    }

    const content = await ContentModel.find({
        userId :Link.userId
    })

     const user= await UserModel.findOne({
        _id :Link.userId
    })

    if(!user){
        res.status(411).json({
            message:"user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username : user.username,
        content :content
    })
});

export default app;

