import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register(registerDto: RegisterDto) {
        const email = registerDto.email.trim().toLowerCase();
        const passwordHash = await argon2.hash(registerDto.password);

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        return this.prisma.user.create({
            data: {
                email,
                password: passwordHash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
    }
}
