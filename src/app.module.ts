import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PolicyholderService } from './policyholder/policyholder.service';
import { PolicyholderController } from './policyholder/policyholder.controller';
import { LegalAddressController } from './legal-address/legal-address.controller';
import { CreditStatusController } from './credit-status/credit-status.controller';
import { BlacklistController } from './blacklist/blacklist-controller';

@Module({
  imports: [],
  controllers: [AppController, PolicyholderController, LegalAddressController, CreditStatusController, BlacklistController],
  providers: [AppService, PolicyholderService],
})
export class AppModule {}
