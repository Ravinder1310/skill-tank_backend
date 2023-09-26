import { ComparePassword, HashPassword } from "../helper/authHelper.js";
import jwt from "jsonwebtoken"
import userModel from "../model/userModel.js";


// get all users
export const UserController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "All Users List",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all users",
    });
  }
}

export const registerController = async(req,res) => {
    try {
        const {name,email,password,answer} = req.body;

        if(!name){
           return res.send({message:"Name is required"})
        }
        if(!email){
            return res.send({message:"Email is required"})
         }
         if(!password){
            return res.send({message:"Password is required"})
         }
         if(!answer){
            return res.send({message:"Answer is required"})
         }

        // checking user
        const existingUser = await userModel.findOne({email})
         
         // existing user
        if(existingUser){
          return res.send(200).send({
            success:false,
            message:"Already Register please login"
          })
        }

        // register user
        const hashedPassword = await HashPassword(password);
        //save
        const user = await new userModel({name,email,password:hashedPassword,answer}).save();
        res.status(200).send({
            success:true,
            message:"User Registered succesfully",
            user,
        })

    } catch (error) {
        console.log(error);
        res.send(500).send({
            success:false,
            message:"Error in Registeration",
            error
        })
    }
}

// POST LOGIN
export const loginController = async(req,res) => {
   try {
    const {email,password} = req.body
    //validation 
    if(!email || !password){
        return res.status(404).send({
            success:false,
            message:"Invalid email or password"
        })
    }
    //check user
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(500).send({
            success:false,
            message:"Email is not registered"
        })
    }
    const match = await ComparePassword(password,user.password)
    if(!match){
        return res.status(200).send({
            success:false,
            message:"Invalid password"
        })
    }

    //token
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });

    res.status(200).send({
            success:true,
            message:"Login succesfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },
            token
    })

   } catch (error) {
      console.log(error);
      res.send(500).send({
        success:false,
        message:"Error in Login",
        error
      })
   }
}

// forgotPasswordController
export const forgotPasswordController = async(req,res) => {
      try {
        const {email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({message:"Email is required"})
        }
        if(!answer){
            res.status(400).send({message:"Answer is required"})
        }
        if(!newPassword){
            res.status(400).send({message:"New password is required"})
        }

       // check
        const user = await userModel.findOne({email,answer})

        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong email or answer"
            })
        }

        const hashed = await HashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:"Password reset successfully"
        })

      } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
      }
}

// update profile controller
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await HashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };