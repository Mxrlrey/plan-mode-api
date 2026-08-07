import {Module} from "@nestjs/common";
import {ForecastService} from "@/modules/forecast/forecast.service";
import {ForecastController} from "@/modules/forecast/forecast.controller";

@Module ({
    controllers: [ForecastController],
    providers: [ForecastService],
})


export class ForecastModule {}