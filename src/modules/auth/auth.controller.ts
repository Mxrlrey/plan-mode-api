import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "@/modules/auth/auth.service";
import {RegisterDto} from "@/modules/auth/dto/register.dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
