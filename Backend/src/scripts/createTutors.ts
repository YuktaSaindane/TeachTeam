import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

// Validates email format using regex pattern (same as auth controller)
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validates password strength requirements (same as auth controller)
const validatePassword = (password: string) => {
  if (!password || password.length < 8 || password.length > 128) {
    return false;
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

const createTutors = async () => {
  try {
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);

    // Create 5 tutor accounts with proper validation
    const tutors = [
      { 
        name: "Alice Johnson", 
        email: "alice.johnson@student.rmit.edu.au", 
        password: "Tutor@123",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
      },
      { 
        name: "Bob Smith", 
        email: "bob.smith@student.rmit.edu.au", 
        password: "Tutor@123",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
      },
      { 
        name: "Charlie Brown", 
        email: "charlie.brown@student.rmit.edu.au", 
        password: "Tutor@123",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
      },
      { 
        name: "Diana Prince", 
        email: "diana.prince@student.rmit.edu.au", 
        password: "Tutor@123",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana"
      },
      { 
        name: "Ethan Hunt", 
        email: "ethan.hunt@student.rmit.edu.au", 
        password: "Tutor@123",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan"
      }
    ];

    let createdCount = 0;

    for (const tutorData of tutors) {
      // Validate email format
      if (!validateEmail(tutorData.email)) {
        console.log(`❌ Invalid email format for ${tutorData.name}: ${tutorData.email}`);
        continue;
      }

      // Validate password strength
      if (!validatePassword(tutorData.password)) {
        console.log(`❌ Invalid password for ${tutorData.name}: Password must be 8-128 characters with uppercase, lowercase, number, and special character`);
        continue;
      }

      // Check if tutor already exists
      let tutor = await userRepo.findOne({ where: { email: tutorData.email } });
      if (!tutor) {
        try {
          // Hash password with bcrypt (salt rounds: 10)
          const hashedPassword = await bcrypt.hash(tutorData.password, 10);

          tutor = userRepo.create({
            name: tutorData.name,
            email: tutorData.email,
            password: hashedPassword,
            role: "candidate", // Tutors are candidates in the system
            avatar_url: tutorData.avatar_url,
            is_blocked: false
          });

          await userRepo.save(tutor);
          console.log(`✅ Created tutor: ${tutorData.name} (${tutorData.email})`);
          createdCount++;
        } catch (error) {
          console.log(`❌ Error creating tutor ${tutorData.name}:`, error);
        }
      } else {
        console.log(`⚠️  Tutor already exists: ${tutorData.name} (${tutorData.email})`);
      }
    }

    console.log(`\n🎉 Tutor seeding completed! Created ${createdCount} new tutors.`);
    console.log("\n📋 Tutor Credentials:");
    console.log("┌─────────────────┬──────────────────────────────────────┬─────────────┐");
    console.log("│ Name            │ Email                                │ Password    │");
    console.log("├─────────────────┼──────────────────────────────────────┼─────────────┤");
    
    for (const tutor of tutors) {
      console.log(`│ ${tutor.name.padEnd(15)} │ ${tutor.email.padEnd(36)} │ ${tutor.password.padEnd(11)} │`);
    }
    
    console.log("└─────────────────┴──────────────────────────────────────┴─────────────┘");
    console.log("\n💡 All tutors can login and apply for tutor positions!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating tutors:", error);
    process.exit(1);
  }
};

createTutors(); 