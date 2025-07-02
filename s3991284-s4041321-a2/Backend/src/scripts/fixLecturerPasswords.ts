import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

const fixLecturerPasswords = async () => {
  try {
    await AppDataSource.initialize();
    console.log("🔧 Fixing lecturer passwords with correct bcrypt hashing...");

    const userRepo = AppDataSource.getRepository(User);

    // Find all lecturers
    const lecturers = await userRepo.find({ 
      where: { role: "lecturer" } 
    });

    console.log(`Found ${lecturers.length} lecturers to update`);

    // Update each lecturer's password with correct bcrypt hash
    const lecturerCredentials = [
      { email: "smith@rmit.edu.au", password: "Lecturer@123" },
      { email: "johnson@rmit.edu.au", password: "Lecturer@123" },
      { email: "williams@rmit.edu.au", password: "Lecturer@123" }
    ];

    let updatedCount = 0;

    for (const credential of lecturerCredentials) {
      const lecturer = await userRepo.findOne({ 
        where: { email: credential.email, role: "lecturer" } 
      });

      if (lecturer) {
        // Hash password with correct bcrypt library
        const hashedPassword = await bcrypt.hash(credential.password, 10);
        
        // Update the lecturer's password
        lecturer.password = hashedPassword;
        await userRepo.save(lecturer);
        
        console.log(`✅ Updated password for ${lecturer.name} (${lecturer.email})`);
        updatedCount++;
      } else {
        console.log(`⚠️  Lecturer not found: ${credential.email}`);
      }
    }

    console.log(`\n🎉 Password fix completed! Updated ${updatedCount} lecturer passwords.`);
    console.log("\n🔐 All lecturers now use consistent bcrypt hashing:");
    console.log("• Dr. Smith: smith@rmit.edu.au / Lecturer@123");
    console.log("• Dr. Johnson: johnson@rmit.edu.au / Lecturer@123");
    console.log("• Prof. Williams: williams@rmit.edu.au / Lecturer@123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing lecturer passwords:", error);
    process.exit(1);
  }
};

fixLecturerPasswords(); 