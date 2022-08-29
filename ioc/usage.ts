import { Provide, Inject, Container } from './ioc'

@Provide('DriverService')
class Driver {
  adapt(consumer: string) {
    console.log(`\n === 驱动已生效于 ${consumer}！===\n`);
  }
}


@Provide('Car')
class Car {
  @Inject('DriverService')
  driver!: Driver

  run() {
    this.driver.adapt('Car')
  }
}

const car = Container.get('Car');
car.run()


