const carReserveService = require('../../../src/services/car.reserve.service');
const carReservemodel = require('../../../src/models/car.reserve.model');
const pick = require('../../../src/utils/pick');

describe('car reserve test', () => {
  const user_id = '6cc9e241-7690-4983-b298-fed3576f2835';
  const carReserve = {
    car_no: '10하0010',
    start_reserve: `2022-07-27 16:38:23`,
    end_reserve: `2022-07-27 16:38:23`,
  };

  it('getReserveInfo', async () => {
    const reserveInfo = await carReserveService.getReserveInfobyUserId(user_id);
    expect(reserveInfo.length).toEqual(0);
  });

  it('createReserve', async () => {
    carReserve.user_id = user_id;
    const reserveInfo = await carReserveService.createReserve(carReserve);
    expect(reserveInfo.car_no).toEqual(carReserve.car_no);
  });

  it('delete Reserve', async () => {
    const recently_reserve = await carReservemodel.findOne();
    const reserveInfo = await carReserveService.deleteReserve(recently_reserve.id, user_id);
    console.log(reserveInfo);
    expect(reserveInfo.id).toEqual(recently_reserve.id);
  });

  it('delete Reserve "Reserve not found"', async () => {
    const recently_reserve = await carReservemodel.findOne();
    await carReserveService.deleteReserve(recently_reserve.id, user_id).catch((e) => {
      expect(e.message).toEqual('Reserve not found');
    });
  });
});
