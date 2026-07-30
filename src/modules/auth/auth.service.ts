import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import * as argon2 from 'argon2';


import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';

import { PrismaService } from '@/prisma/prisma.service';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

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

    async login(loginDto: LoginDto) {
        const email = loginDto.email.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await argon2.verify(user.password, loginDto.password);

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email
        })

        return {
            access_token: accessToken,
        };
    }
}
