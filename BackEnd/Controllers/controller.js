const Login = require("../Models/login")
const Employee = require("../Models/employee")
const Session = require("../Models/session")
const { Op } = require('sequelize'); // Sequelize operators
const { generateToken, refreshToken } = require("../jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username.trim() === '' | !password || password.trim() === '') {
      return res.status(400).json({ message: "Bad Request : username and Passwords are Required Fields" });
    }

    const user = await Login.findOne({ where: { f_userName: username } });
    if (user) {
      const hashResult = await bcrypt.compare(password, user.f_Pwd);
      if (hashResult) {

        const payload = {
          id: user.f_sno,
          email: user.f_userName
        };
        const accesstoken = generateToken(payload);
        const refreshtoken = refreshToken(payload);

        const accesstoken_expirationTime = new Date();
        accesstoken_expirationTime.setTime(
          accesstoken_expirationTime.getTime() + 15 * 60 * 1000
        );

        const refreshtoken_expirationTime = new Date();
        refreshtoken_expirationTime.setTime(
          refreshtoken_expirationTime.getTime() + 24 * 60 * 60 * 1000
        );

        await Session.create({
          user_id: user.f_sno,
          access_token: accesstoken,
          access_token_expiration: accesstoken_expirationTime,
          refresh_token: refreshtoken,
          refresh_token_expiration: refreshtoken_expirationTime,
        });

        res
          .status(200)
          .json({
            accesstoken: accesstoken,
            refreshtoken: refreshtoken,
            access_token_expiration: accesstoken_expirationTime,
            refresh_token_expiration: refreshtoken_expirationTime,
          });

      }
    }
    else {
      res.status(400).json({ error: "Login Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

const refresh = async (req, res) => {
  try {

    const refreshToken = req.body.refreshtoken;
    if (!refreshToken) return res.sendStatus(401);
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userdetails = await Login.findOne({
      where: {
        f_sno: decodedToken.id,
      },
    });
    if (!userdetails) {
      return res.status(401).json({
        error: "Invalid access token or token expired / log-in again",
      });
    }
    const sessiondetails = await Session.findOne({
      where: {
        [Op.and]: [
          { user_id: userdetails.f_sno },
          { refresh_token: refreshToken },
          { refresh_token_expiration: { [Op.gt]: new Date() } },
        ],
      },
    });

    if (!sessiondetails) {
      return res
        .status(401)
        .json({ error: "Invalid refresh token or token expired" });
    }
    const payload = { id: userdetails.f_sno, name: userdetails.f_userName };
    const newAccessToken = generateToken(payload);
    const newAccessTokenExpiration = new Date();
    newAccessTokenExpiration.setTime(
      newAccessTokenExpiration.getTime() + 15 * 60 * 1000
    ); // 15 minutes for access token
    console.log("Logout successful");

    await Session.update(
      {
        access_token: newAccessToken,
        access_token_expiration: newAccessTokenExpiration,
      },
      {
        where: {
          [Op.and]: [
            { user_id: userdetails.f_sno },
            { refresh_token: refreshToken },
            { refresh_token_expiration: { [Op.gt]: new Date() } },
          ],
        },
      }
    );

    res.status(200).json({
      access_Token: newAccessToken,
      access_Token_expiration: newAccessTokenExpiration,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

const logout = async (req, res) => {
  try {
    const userid = req.userid
    const username = req.userName;

    if (!userid || !username) {
      return res.status(400).json({ error: "User ID and username  are required field" });
    }

    const logoutResult = await Session.update(
      {
        access_token: "userLoggedOut",
        refresh_token: "userLoggedOut",
      },
      {
        where: {
          user_id: userid,
        },
      }
    );

    if (logoutResult > 0) {
      res.status(200).json({ logout: "Logout Successful" });
    } else {
      res.status(200).json({ logout: "Something went wrong" });
    }

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addLoginUser = async (req, res) => {
  try {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: "Username is required" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });

    }

    const findUser = await Login.findAll({ where: { f_userName: username } })

    if (username) {
      return res.status(400).json({ error: "Username is already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const createLoginUser = await Login.create({ f_userName: username, f_Pwd: hashedpassword });

    if (createLoginUser) {
      return res.status(200).json({ message: 'User created successfully:', createLoginUser });
    } else {
      return res.status(400).json({ error: 'User creation failed' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

const createEmployee = async (req, res) => {
  try {

    const { EmployeeName, Email, MobileNo, Designation, Gender, Course, Image } = req.body;

    if (!EmployeeName || EmployeeName.trim() === '') {
      return res.status(400).json({ error: "EmployeeName is required" });
    }

    if (!Email || EmployeeName.trim() === '') {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!MobileNo) {
      return res.status(400).json({ error: "MobileNo is required" });
    }

    if (MobileNo.length !== 10) {
      return res.status(400).json({ error: "MobileNo must be exactly 10 digits long" });
    }

    if (!Designation || Designation.trim() === '') {
      return res.status(400).json({ error: "Designation is required" });
    }

    if (!Gender || Gender.trim() === '') {
      return res.status(400).json({ error: "Gender is required" });
    }

    if (!Course || Course.trim() === '') {
      return res.status(400).json({ error: "Course is required" });
    }

    // if (!Image) {
    //   return res.status(400).json({ error: "Image is required" });
    // }

    const CreateDate = new Date();
    const contact = parseInt(MobileNo, 10);

    const createEmployees = await Employee.create({ f_image: Image, f_Name: EmployeeName, f_Email: Email, f_Mobile: contact, f_Designation: Designation, f_gender: Gender, f_Course: Course, f_CreateDate: CreateDate });

    if (createEmployees) {

      return res.status(200).json({ message: "Employee created successfully" });

    } else {
      return res.status(400).json({ error: "Employee creation failed" });

    }

  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

const editEmployee = async (req, res) => {
  try {

    const { Employeeid, EmployeeName, Email, MobileNo, Designation, Gender, Course, Image } = req.body;

    if (!Employeeid) {
      return res.status(400).json({ error: "EmployeeName is required" });
    }

    if (!EmployeeName || EmployeeName.trim() === '') {
      return res.status(400).json({ error: "EmployeeName is required" });
    }

    if (!Email || EmployeeName.trim() === '') {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!MobileNo) {
      return res.status(400).json({ error: "MobileNo is required" });
    }

    // if (MobileNo.length !== 10) {
    //   return res.status(400).json({ error: "MobileNo must be exactly 10 digits long" });
    // }

    if (!Designation || Designation.trim() === '') {
      return res.status(400).json({ error: "Designation is required" });
    }

    if (!Gender || Gender.trim() === '') {
      return res.status(400).json({ error: "Gender is required" });
    }

    if (!Course || Course.trim() === '') {
      return res.status(400).json({ error: "Course is required" });
    }

    // if (!Image) {
    //   return res.status(400).json({ error: "Image is required" });
    // }
    const contact = parseInt(MobileNo, 10);

    const UpdateEmployees = await Employee.update(
      { f_image: Image, f_Name: EmployeeName, f_Email: Email, f_Mobile: contact, f_Designation: Designation, f_gender: Gender, f_Course: Course },
      {
        where: {
          f_id: Employeeid,
        },
      },
    );

    if (UpdateEmployees) {

      return res.status(200).json({ message: "Employee Edited successfully" });

    } else {
      return res.status(400).json({ error: "Employee Update failed" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};


const deleteEmployee = async (req, res) => {
  try {
    const { Employeeid } = req.body;
    if (!Employeeid) {
      return res.status(400).json({ error: "EmployeeName is required" });
    }

    const empDelete = await Employee.destroy({ where: { f_id: Employeeid } });

    if (empDelete) {
      return res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      return res.status(404).json({ error: "Employee not found" });
    }


  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

const chooseEmployee = async (req, res) => {
  // try {
  //   const {Employeeid } = req.body;
  //   if (!Employeeid) {
  //     return res.status(400).json({ error: "EmployeeId is required" });
  //   }

  //   const findEmployee = await Employee.findOne({where:{f_id:Employeeid}})
  //   console.log(findEmployee);


  //   if (findEmployee) {
  //     return res.status(200).json({ message: "Employee Found Successfully" ,findEmployee});
  //   } else {
  //     return res.status(404).json({ error: "Employee Id doesNot Exists" });
  //   }

  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json("internal server error");
  // }
  const employeeId = req.params.id;

  try {
    const employee = await Employee.findOne({ where: { f_id: employeeId } });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ findEmployee: employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}


// const searchEmployee = async (req, res) => {
//   try {
//     const { employeeName, employeeEmail, employeeId, joinDate } = req.query; // Assuming you get filters from query parameters

//     // { f_image:Image, f_Name:EmployeeName, f_Email:Email, f_Mobile:contact, f_Designation:Designation, f_gender:Gender, f_Course:Course, f_CreateDate:CreateDate },
//     // Construct the filter conditions
//     const filterConditions = {};

//     if (employeeName) {
//       filterConditions.f_Name = { [Op.like]: `%${employeeName}%` }; // Filter by name, using LIKE for partial matches
//     }

//     if (employeeEmail) {
//       filterConditions.f_Email = employeeEmail; // Exact match for email
//     }

//     if (employeeId) {
//       filterConditions.f_id = employeeId; 
//     }
//     if (joinDate) {
//       filterConditions.f_CreateDate = joinDate; 
//     }

//     console.log('Filter Conditions:', filterConditions.f_id);
//     // Fetch employees with the specified filters
//     const employees = await Employee.findAll({ where: filterConditions });

//     // Send response with filtered data
//     if(employees.length>0)
//     {
//       return res.status(200).json(employees);
//     }
//     else{
//       return res.status(400).json({message:"Employee doestn't exists"});
//     }

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


const searchEmployee = async (req, res) => {
  try {
    const { search } = req.query; // Single search parameter
    console.log(search);

    const filterConditions = {
      [Op.or]: [
        { f_Name: { [Op.like]: `%${search}%` } }, // Search by name
        { f_Email: { [Op.like]: `%${search}%` } }, // Search by email
        { f_id: { [Op.like]: `%${search}%` } }, // Search by ID   { [Op.like]: `%${search}%` }
        { f_CreateDate: { [Op.like]: `%${search}%` } }, // Search by join date
      ],
    };

    const employees = await Employee.findAll({ where: filterConditions });
    console.log(employees);

    if (employees.length > 0) {
      return res.status(200).json(employees);
    } else {
      return res.status(404).json({ message: "Employee doesn't exist" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const showAllEmployee = async (req, res) => {
  try {
    const { count, rows } = await Employee.findAndCountAll();
    console.log(count);
    console.log(rows);

    if (rows.length > 0) {
      return res.status(200).json({ count, rows });
    } else {

      return res.status(404).json({ message: "No employees found" });
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { login, logout, refresh, createEmployee, editEmployee, deleteEmployee, searchEmployee, addLoginUser, chooseEmployee, showAllEmployee };
