import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { User, UserDocument, UserRole, UserStatus } from '../users/schemas/user.schema';

export const SEED_USERS = [
  {
    fullName: 'Mahmoud Abdalrahman',
    email: 'mahmoud.abdalrahman@syntecxhub.io',
    phoneNumber: '+20 100 512 8400',
    avatar: 'https://ui-avatars.com/api/?name=Mahmoud+Abdalrahman&background=0F172A&color=38BDF8&bold=true',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'Platform Architecture',
    jobTitle: 'Principal Full-Stack Architect',
  },
  {
    fullName: 'Nadia El-Masry',
    email: 'nadia.elmasry@syntecxhub.io',
    phoneNumber: '+20 102 341 9920',
    avatar: 'https://ui-avatars.com/api/?name=Nadia+El-Masry&background=1E293B&color=34D399&bold=true',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'Cloud Infrastructure',
    jobTitle: 'VP of Infrastructure Engineering',
  },
  {
    fullName: 'Karim Mansour',
    email: 'karim.mansour@syntecxhub.io',
    phoneNumber: '+20 111 890 4211',
    avatar: 'https://ui-avatars.com/api/?name=Karim+Mansour&background=1E293B&color=818CF8&bold=true',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    department: 'Product Operations',
    jobTitle: 'Operations Lead',
  },
  {
    fullName: 'Salma Hassan',
    email: 'salma.hassan@syntecxhub.io',
    phoneNumber: '+20 109 773 1184',
    avatar: 'https://ui-avatars.com/api/?name=Salma+Hassan&background=1E293B&color=F472B6&bold=true',
    role: UserRole.EDITOR,
    status: UserStatus.ACTIVE,
    department: 'Design Systems',
    jobTitle: 'Senior Product Designer',
  },
  {
    fullName: 'Omar Farouk',
    email: 'omar.farouk@syntecxhub.io',
    phoneNumber: '+20 122 640 3098',
    avatar: 'https://ui-avatars.com/api/?name=Omar+Farouk&background=1E293B&color=F59E0B&bold=true',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    department: 'Security Operations',
    jobTitle: 'Lead SecOps Engineer',
  },
  {
    fullName: 'Yasmine Khedr',
    email: 'yasmine.khedr@syntecxhub.io',
    phoneNumber: '+20 106 884 1920',
    avatar: 'https://ui-avatars.com/api/?name=Yasmine+Khedr&background=1E293B&color=38BDF8&bold=true',
    role: UserRole.EDITOR,
    status: UserStatus.INACTIVE,
    department: 'Customer Success',
    jobTitle: 'Enterprise Onboarding Lead',
  },
  {
    fullName: 'Ziad El-Gohary',
    email: 'ziad.elgohary@syntecxhub.io',
    phoneNumber: '+20 100 918 6642',
    avatar: 'https://ui-avatars.com/api/?name=Ziad+El-Gohary&background=1E293B&color=94A3B8&bold=true',
    role: UserRole.VIEWER,
    status: UserStatus.SUSPENDED,
    department: 'External Vendor Audit',
    jobTitle: 'Compliance Contractor',
  },
];

async function runSeed() {
  const logger = new Logger('Project1UsersSeed');
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    await userModel.deleteMany({});
    const inserted = await userModel.insertMany(SEED_USERS);
    logger.log(`Seeded ${inserted.length} users into MongoDB.`);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  runSeed();
}
