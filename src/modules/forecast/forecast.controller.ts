import {ApiBearerAuth} from "@nestjs/swagger";
import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {JwtGuard} from "@/modules/auth/guards/jwt.guard";
import {ForecastService} from "@/modules/forecast/forecast.service";
import {CurrentUser} from "@/modules/auth/decorators/current-user.decorator";
import {AuthenticatedUser} from "@/modules/auth/types/authenticated-user.interface";
import {ForecastQueryDto} from "@/modules/forecast/dto/forecast-query.dto";

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('forecast')
export class ForecastController {
    constructor(private readonly forecastService: ForecastService) {}

    @Get()
    generate(
        @Query() forecastQueryDto: ForecastQueryDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.forecastService.generate(forecastQueryDto, user.id)
    }
}