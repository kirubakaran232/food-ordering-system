// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const multer = require("multer");
// const bcrypt = require("bcrypt"); // For hashing passwords
// const path = require("path");
// const app = express();
// const PORT = 3000;


// app.use(express.json());
// app.use(cors());
// app.use(
//   "/backend/uploads",
//   express.static(path.join(__dirname, "backend/uploads"))
// ); // Serve uploaded images from the new directory

// // MongoDB Connection
// const mongoURI = "mongodb://localhost:27017/foodOrdering";
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Multer Configuration for Image Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "backend/uploads/"); // Save uploaded files in the "backend/uploads" folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to avoid duplicate names
//   },
// });
// const upload = multer({ storage });

// // User Schema and Model
// const userSchema = new mongoose.Schema({
//   full_name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone_number: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // Food Schema and Model
// const foodSchema = new mongoose.Schema({
//   name: String,
//   category: String,
//   rating: String,
//   price: Number,
//   img: String, // Stores the image file path
// });

// const Food = mongoose.model("Food", foodSchema);

// // Route: Fetch Foods
// app.get("/api/foods", async (req, res) => {
//   try {
//     const foods = await Food.find();
//     res.json(foods);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch foods" });
//   }
// });

// // Route: Add New Food (with Image Upload)
// app.post("/api/foods", upload.single("image"), async (req, res) => {
//   try {
//     const { name, category, rating, price } = req.body;
//     const imgPath = req.file ? `/backend/uploads/${req.file.filename}` : null;

//     const newFood = new Food({ name, category, rating, price, img: imgPath });
//     await newFood.save();

//     res.status(201).json({ message: "Food added successfully", food: newFood });
//   } catch (err) {
//     console.error("Error adding food:", err);
//     res.status(500).json({ error: "Failed to add food" });
//   }
// });


// // Admin Schema and Model
// const adminSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const Admin = mongoose.model("Admin", adminSchema);

// // Seed Admin Credentials
// async function seedAdmin() {
//   const adminEmail = "skirubakaran2005@gmail.com";
//   const adminPassword = "kiruba@121";

//   const existingAdmin = await Admin.findOne({ email: adminEmail });
//   if (!existingAdmin) {
//     const hashedPassword = await bcrypt.hash(adminPassword, 10);
//     const newAdmin = new Admin({ email: adminEmail, password: hashedPassword });
//     await newAdmin.save();
//     console.log("Admin seeded successfully");
//   } else {
//     console.log("Admin already exists");
//   }
// }
// seedAdmin();

// // Admin Login Route
// app.post("/admin-login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     res.status(200).json({
//       message: "Admin login successful",
//       admin: { email: admin.email },
//     });
//   } catch (err) {
//     console.error("Admin login error:", err);
//     res.status(500).json({ error: "An error occurred during admin login" });
//   }
// });


// // Route: Sign Up
// app.post("/signup", async (req, res) => {
//   const { full_name, email, phone_number, password } = req.body;

//   if (!full_name || !email || !phone_number || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       full_name,
//       email,
//       phone_number,
//       password: hashedPassword,
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Error during sign-up:", err);
//     res.status(500).json({ error: "Failed to register user" });
//   }
// });

// // Login Route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     res
//       .status(200)
//       .json({
//         message: "Login successful",
//         user: { email: user.email, full_name: user.full_name },
//       });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "An error occurred during login" });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt"); // For hashing passwords
const path = require("path");
const Transaction = require("./models/Transaction");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const mongoURI = "mongodb://localhost:27017/foodOrdering";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.join(__dirname, "/uploads/")); // Save uploaded files in the "backend/uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to avoid duplicate names
  },
});
const upload = multer({ storage });


// User Schema and Model
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Food Schema and Model
const foodSchema = new mongoose.Schema({
  name: String,
  category: String,
  rating: String,
  price: Number,
  img: String, // Stores the image file path
});

const Food = mongoose.model("Food", foodSchema);

// Route: Fetch Foods
app.get("/api/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch foods" });
  }
});
// Route: Add New Food (with Image Upload)
app.post("/api/foods", upload.single("image"), async (req, res) => {
  try {
    const { name, category, rating, price } = req.body;
    const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

    const newFood = new Food({ name, category, rating, price, img: imgPath });
    await newFood.save();

    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (err) {
    console.error("Error adding food:", err);
    res.status(500).json({ error: "Failed to add food" });
  }
});
// app.post("/api/verify-payment", async (req, res) => {
//   const { amount, transactionId, items } = req.body;

//   console.log("Incoming Request Body:", req.body); // Log incoming request

//   if (!transactionId || amount <= 0) {
//     console.log("Invalid payment details");
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid payment details." });
//   }

//   try {
//     // Simulate payment validation
//     const isPaymentValid = true; // Replace with actual validation logic

//     if (isPaymentValid) {
//       console.log("Payment validated, attempting to save transaction...");

//       const transaction = new Transaction({
//         transactionId,
//         amount,
//         items,
//         paymentMethod: "UPI",
//         timestamp: new Date(),
//       });

//       await transaction.save(); // Save to MongoDB

//       console.log("Transaction successfully saved:", transaction);
//       res.json({ success: true, transactionId });
//     } else {
//       console.log("Payment validation failed");
//       res
//         .status(400)
//         .json({ success: false, message: "Payment validation failed." });
//     }
//   } catch (error) {
//     console.error("Error saving transaction:", error);

//     if (error.code === 11000) {
//       // Handle duplicate transactionId error
//       console.error("Duplicate transactionId detected:", transactionId);
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate transactionId. Transaction already exists.",
//       });
//     }

//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });

// app.post("/api/verify-payment", async (req, res) => {
//   const { amount, transactionId, items } = req.body;

//   console.log("Incoming Request Body:", req.body); // Log incoming request

//   if (!transactionId || amount <= 0) {
//     console.log("Invalid payment details");
//     return res
//       .status(400)
//       .json({ success: false, message: "Invalid payment details." });
//   }

//   try {
//     console.log("Attempting to validate and save transaction...");

//     // Simulate payment validation (you can replace it with your actual payment gateway logic)
//     const isPaymentValid = true; // Replace with actual validation logic

//     if (isPaymentValid) {
//       console.log("Payment validated, attempting to save transaction...");

//       const transaction = new Transaction({
//         transactionId:transactionId.trim(),
//         amount,
//         items,
//         paymentMethod: "UPI",
//         timestamp: new Date(),
//       });

//       await transaction.save(); // Save to MongoDB

//       console.log("Transaction successfully saved:", transaction);

//       // Return success response with transactionId
//       return res.json({
//         success: true,
//         message: "Payment verified and saved successfully.",
//         transactionId: transaction.transactionId, // Return transactionId for bill generation
//       });
//     } else {
//       console.log("Payment validation failed");
//       res
//         .status(400)
//         .json({ success: false, message: "Payment validation failed." });
//     }
//   } catch (error) {
//     console.error("Error saving transaction:", error);

//     if (error.code === 11000) {
//       // Handle duplicate transactionId error
//       console.error("Duplicate transactionId detected:", transactionId);
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate transactionId. Transaction already exists.",
//       });
//     }

//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });



// // Endpoint to fetch transaction details
// app.get('/api/transaction/:transactionId', async (req, res) => {
//   const { transactionId } = req.params;

//   try {
//     const transaction = await Transaction.findOne({ transactionId }); // Find transaction by ID
//     if (!transaction) {
//       return res.status(404).json({ success: false, message: "Transaction not found" });
//     }

//     res.json({ success: true, transaction });
//   } catch (error) {
//     console.error("Error fetching transaction:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });
const transactions = {
  Test123: {
    timestamp: new Date().toISOString(),
    items: [
      { name: "Pizza", price: 200, quantity: 2 },
      { name: "Burger", price: 150, quantity: 1 },
    ],
  },
};
app.get("/api/transaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  const transaction = transactions[transactionId];

  if (transaction) {
    res.json({ success: true, transaction });
  } else {
    res.status(404).json({ success: false, message: "Transaction not found" });
  }
});
const simulatePaymentValidation = (transactionId, amount) => {
  // Simulate success for odd transaction IDs
  const isValid = parseInt(transactionId.split("-").pop(), 10) % 2 === 1;

  return isValid && amount > 0; // Payment is valid if transaction ID is odd and amount > 0
};

const validatePayment = async (req, res) => {
  const { transactionId, amount, items } = req.body;

  try {
    // Simulate payment validation
    const isPaymentValid = simulatePaymentValidation(transactionId, amount);

    if (isPaymentValid) {
      // Save the transaction to MongoDB
      const transaction = new Transaction({
        transactionId,
        amount,
        items,
        paymentMethod: "Simulated UPI", // Indicate it's a simulated payment
        timestamp: new Date(),
      });

      await transaction.save(); // Save transaction to MongoDB
      console.log("Transaction saved successfully:", transaction);

      res.json({
        success: true,
        message: "Payment verified successfully.",
        transactionId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment validation failed. Simulated environment.",
      });
    }
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = validatePayment;



// Admin Schema and Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

// Seed Admin Credentials
async function seedAdmin() {
  const adminEmail = "skirubakaran2005@gmail.com";
  const adminPassword = "kiruba@121";

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const newAdmin = new Admin({ email: adminEmail, password: hashedPassword });
    await newAdmin.save();
    console.log("Admin seeded successfully");
  } else {
    console.log("Admin already exists");
  }
}
seedAdmin();


//profile
// User Schema
// Order Schema
const orderSchema = new mongoose.Schema({
  user_email: String,
  total_orders_today: Number,
  total_spent_today: Number,
  total_orders_month: Number,
  total_spent_month: Number,
  total_orders_year: Number,
  total_spent_year: Number,
});

const Order = mongoose.model("Order", orderSchema);

// Routes
app.get("/api/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Error fetching user details" });
  }
});

app.get("/api/orders/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const orderSummary = await Order.findOne({ user_email: email });
    if (!orderSummary) return res.status(404).json({ error: "Orders not found" });
    res.status(200).json({ orderSummary });
  } catch (err) {
    res.status(500).json({ error: "Error fetching order details" });
  }
});

// Admin Login Route
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Admin login successful",
      admin: { email: admin.email },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "An error occurred during admin login" });
  }
});

// Route: Sign Up
app.post("/signup", async (req, res) => {
  const { full_name, email, phone_number, password } = req.body;

  if (!full_name || !email || !phone_number || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      full_name,
      email,
      phone_number,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, full_name: user.full_name },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
