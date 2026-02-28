import { World, setWorldConstructor } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';

export interface TestUser {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  zip: string;
}

export class CustomWorld extends World {
  public currentUser?: TestUser;

  generateTestUser(): TestUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user: TestUser = {
      email: faker.internet.email({ firstName, lastName, provider: 'test.example.com' }),
      firstName,
      lastName,
      phone: faker.phone.number({ style: 'national' }),
      zip: faker.location.zipCode('#####'),
    };
    this.currentUser = user;
    return user;
  }
}

setWorldConstructor(CustomWorld);
