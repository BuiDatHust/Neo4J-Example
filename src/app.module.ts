import { Module } from '@nestjs/common';
import { OrganizationModule } from './organization/organization.module';
import { EnvironmentModule } from './environment';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [OrganizationModule, EnvironmentModule.forRoot(), EmployeeModule],
})
export class AppModule {}
