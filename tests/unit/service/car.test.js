const carService = require('../../../src/services/car.service');
const pick = require('../../../src/utils/pick');

describe('car test', () => {
  const car = {
    car_id: 'test-car',
    car_nm: 'my car',
    car_no: '11하1234',
    car_model_nm: '테슬라',
    car_color: 'c8c8c8',
    lat: null,
    lng: null,
    onoff: 0,
  };
  describe('car manage', () => {
    beforeAll(async () => {
      if ((await carService.getCarById(car.car_id)) !== undefined) {
        await carService.deleteCarById(car.car_no);
      }
    });

    it('should return created car ', async () => {
      // await carService.deleteCarById(car.car_no);
      const create_car = pick(car, ['car_id', 'car_nm', 'car_no', 'car_model_nm', 'car_color']);
      const result_car = await carService.createCarManage(create_car);
      const pick_car = pick(result_car, ['car_id', 'car_nm', 'car_no', 'car_model_nm', 'car_color']);
      expect(pick_car).toEqual(create_car);
    });

    it('should return created car "CarNo already taken" ', async () => {
      // await carService.deleteCarById(car.car_no);
      const create_car = pick(car, ['car_id', 'car_nm', 'car_no', 'car_model_nm', 'car_color']);
      create_car.car_id = 'test11';
      create_car.car_no = '11하1234';
      create_car.car_color = 'c8c8c7';
      await carService.createCarManage(create_car).catch((e) => {
        expect(e.message).toEqual('CarNo already taken');
      });
    });

    it('should return created car "CarColor already taken" ', async () => {
      // await carService.deleteCarById(car.car_no);
      const create_car = pick(car, ['car_id', 'car_nm', 'car_no', 'car_model_nm', 'car_color']);
      create_car.car_id = 'test11';
      create_car.car_no = '11하12366';
      create_car.car_color = 'c8c8c8';
      await carService.createCarManage(create_car).catch((e) => {
        expect(e.message).toEqual('CarColor already taken');
      });
    });

    it('should return created car "CarId already taken"', async () => {
      await carService.createCarManage(car).catch((e) => {
        expect(e.message).toEqual('CarId already taken');
      });
    });

    it('should return car by car_no ', async () => {
      const result_car = await carService.getCarByIdManage(car.car_no);
      const pick_car = pick(result_car, ['car_id', 'car_nm', 'car_no', 'car_model_nm', 'car_color', 'lat', 'lng', 'onoff']);
      expect(pick_car).toEqual(car);
    });

    it('should return update car "CarColor already taken"', async () => {
      const update_car = pick(car, ['car_nm', 'car_no', 'car_model_nm', 'car_color']);
      update_car.car_no = '11하12366';
      update_car.car_color = 'c8c8c8';
      await carService.updateCarById(car.car_no, update_car).catch((e) => {
        expect(e.message).toEqual('CarColor already taken');
      });
    });

    it('should return update car "CarNo already taken"', async () => {
      const update_car = pick(car, ['car_nm', 'car_no', 'car_model_nm', 'car_color']);
      update_car.car_no = '11하1234';
      update_car.car_color = 'c9c9c9';
      await carService.updateCarById(car.car_no, update_car).catch((e) => {
        expect(e.message).toEqual('car_no already taken');
      });
    });

    it('should return update car', async () => {
      const update_car = pick(car, ['car_nm', 'car_model_nm']);
      update_car.car_model_nm = '람보르기니';
      const result_car = await carService.updateCarById(car.car_no, update_car);
      const pick_car = pick(result_car, ['car_nm', 'car_model_nm']);
      expect(pick_car).toEqual(update_car);
    });

    it('should return deleted car ', async () => {
      const result_car = await carService.deleteCarById(car.car_no);
      const pick_car = pick(result_car, ['car_id', 'car_nm', 'car_no', 'car_model_nm', 'car_color', 'lat', 'lng', 'onoff']);
      car.car_model_nm = '람보르기니';
      expect(pick_car).toEqual(car);
    });

    it('should return "car not found"', async () => {
      const update_car = pick(car, ['car_nm', 'car_no', 'car_model_nm', 'car_color']);
      await carService.updateCarById(update_car.car_no, update_car).catch((e) => {
        expect(e.message).toEqual('car not found');
      });
    });
  });

  describe('car generic', () => {
    it('should return Car all', async () => {
      const car_list = await carService.getCars();
      expect(car_list.length).toEqual(7);
    });

    it('should return update car stat', async () => {
      car.car_id = 'KNMC4C1HMBP000001';
      car.lat = '112233';
      car.lng = '556677';
      const update_body = pick(car, ['lat', 'lng', 'onoff']);
      const result_car = await carService.updateCarStatById(car.car_id, update_body);
      expect(result_car.car_id).toEqual(car.car_id);
    });

    it('should return Car', async () => {
      car.car_id = 'KNMC4C1HMBP000001';
      const result_car = await carService.getCarById(car.car_id);
      expect(result_car.car_id).toEqual(car.car_id);
    });
  });
});
