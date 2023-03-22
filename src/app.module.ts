import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class AppModule {}
