import {Module} from "@nestjs/common";
import {ForecastService} from "@/modules/forecast/forecast.service";
import {ForecastController} from "@/modules/forecast/forecast.controller";
import {PrismaModule} from "@/prisma/prisma.module";

@Module ({
    imports: [PrismaModule],
    controllers: [ForecastController],
    providers: [ForecastService],
})


export class ForecastModule {}