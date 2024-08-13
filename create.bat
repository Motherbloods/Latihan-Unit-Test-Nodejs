@echo off
set /p projectname="Enter your project name: "
mkdir %projectname%
cd %projectname%
mkdir models controllers routes utils __tests__
:: Buat file index.controller.js di folder controllers
echo. > controllers\index.controller.js
echo. > __tests__\index.test.js
echo module.exports = { testEnvironment: 'node' }; > jest.config.js
:: Buat folder models kosong
:: Buat file index.routes.js di folder routes
echo const express = require("express"); > routes\index.routes.js
echo const router = express.Router(); >> routes\index.routes.js
echo const {} = require("../controllers/index.controller") >> routes\index.routes.js
echo module.exports = router; >> routes\index.routes.js
:: Buat file .env dengan isi
echo PORT=8000 > .env
echo URL="mongodb+srv://motherbloodss:XKFofTN9qGntgqbo@cluster0.ejyrmvc.mongodb.net/?retryWrites=true&w=majority" >> .env
:: Buat file .gitIgnore dengan isi
echo /node_modules > .gitIgnore
echo .env >> .gitIgnore
:: Buat file db.js di folder utils
echo const mongoose = require("mongoose"); > utils\db.js
echo require("dotenv").config(); >> utils\db.js
echo. >> utils\db.js
echo const url = process.env.URL; >> utils\db.js
echo. >> utils\db.js
echo const connectToDatabase = async () =^> { >> utils\db.js
echo   try { >> utils\db.js
echo     await mongoose.connect(url, { >> utils\db.js
echo       maxPoolSize: 10, // Jumlah maksimum koneksi dalam pool >> utils\db.js
echo       minPoolSize: 5, // Jumlah minimum koneksi dalam pool >> utils\db.js
echo       connectTimeoutMS: 10000, // Timeout untuk koneksi baru (10 detik) >> utils\db.js
echo       socketTimeoutMS: 45000 // Timeout untuk operasi socket (45 detik) >> utils\db.js
echo     }); >> utils\db.js
echo     console.log("Connected to MongoDB with connection pooling"); >> utils\db.js
echo   } catch (err) { >> utils\db.js
echo     console.error("Error connecting to MongoDB:", err); >> utils\db.js
echo   } >> utils\db.js
echo }; >> utils\db.js
echo. >> utils\db.js
echo // Menangani penutupan koneksi saat aplikasi berhenti >> utils\db.js
echo process.on("SIGINT", async () =^> { >> utils\db.js
echo   try { >> utils\db.js
echo     await mongoose.connection.close(); >> utils\db.js
echo     console.log("MongoDB connection closed"); >> utils\db.js
echo     process.exit(0); >> utils\db.js
echo   } catch (err) { >> utils\db.js
echo     console.error("Error closing MongoDB connection:", err); >> utils\db.js
echo     process.exit(1); >> utils\db.js
echo   } >> utils\db.js
echo }); >> utils\db.js
echo. >> utils\db.js
echo module.exports = { connectToDatabase }; >> utils\db.js
:: Buat file config.js di folder utils
echo const express = require("express"); > utils\config.js
echo const app = express(); >> utils\config.js
echo const cors = require("cors"); >> utils\config.js
echo const bodyParser = require("body-parser"); >> utils\config.js
echo require("dotenv").config(); >> utils\config.js
echo. >> utils\config.js
echo app.use(cors()); >> utils\config.js
echo app.use(express.json()); >> utils\config.js
echo app.use(express.urlencoded({ extended: false })); >> utils\config.js
echo app.use(bodyParser.json()); >> utils\config.js
echo. >> utils\config.js
echo module.exports = app; >> utils\config.js
:: Buat file app.js di root project
echo const app = require("./utils/config"); > app.js
echo const port = process.env.PORT ^|^| 8000; >> app.js
echo. >> app.js
echo const { connectToDatabase } = require("./utils/db"); >> app.js
echo const routes = require("./routes/index.routes"); >> app.js
echo. >> app.js
echo connectToDatabase() >> app.js
echo   .then(() =^> { >> app.js
echo     app.use(routes); >> app.js
echo     app.listen(port, () =^> { >> app.js
echo       console.log("Listening on port " + port); >> app.js
echo     }); >> app.js
echo   }) >> app.js
echo   .catch((err) =^> { >> app.js
echo     console.error("Failed to connect to database:", err); >> app.js
echo     process.exit(1); >> app.js
echo   }); >> app.js
:: Buat file vercel.json
echo { > vercel.json
echo   "version": 2, >> vercel.json
echo   "builds": [ >> vercel.json
echo     { >> vercel.json
echo       "src": "app.js", >> vercel.json
echo       "use": "@vercel/node" >> vercel.json
echo     } >> vercel.json
echo   ], >> vercel.json
echo   "routes": [ >> vercel.json
echo     { >> vercel.json
echo       "src": "/(.*)", >> vercel.json
echo       "dest": "app.js" >> vercel.json
echo     } >> vercel.json
echo   ] >> vercel.json
echo } >> vercel.json
echo Project structure created successfully!
:: Jalankan npm install
call npm install dotenv express mongoose bcrypt jsonwebtoken body-parser cors 
call npm install --save-dev jest
endlocal