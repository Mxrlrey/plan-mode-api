import {Injectable} from "@nestjs/common";
import {ForecastQueryDto} from "@/modules/forecast/dto/forecast-query.dto";

@Injectable()
export class ForecastService {
    generate(forecastQueryDto: ForecastQueryDto, userId: string) {
        return {
            month: forecastQueryDto.month,
            userId,
        };
    }
}