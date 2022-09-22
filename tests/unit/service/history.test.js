const historyService = require('../../../src/services/history.service');
const historyModel = require('../../../src/models/history.model');
const pick = require('../../../src/utils/pick');
const { getIdByNo } = require('../../../src/models/car.model');

describe('car history test', () => {
  const hisData = {
    car_no: '10하0007',
    trip_seq: `2022-07-19 16:00:12`,
    onoff: 0,
    data: {
      colec_dt: `2022-07-19 16:00:11`,
      lat: `37.55455`,
      lng: `126.24`,
    },
  };

  it('getTripSeqList', async () => {
    const result = await historyService.getTripSeqList(hisData.car_no);
    expect(result.length).toEqual(2);
  });



  it('create history onoff_stat 0 to 1', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    hisData.onoff = 1;
    const result_his = await historyService.addHistory(hisData);
    expect(result_his.car_id).toEqual(car_id);
  });

  it('getPathByTrip', async () => {
    const result = await historyService.getPathByTrip(hisData.car_no, hisData.trip_seq);
    expect(result.length).toEqual(1);
  });

  it('delete Trip', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    await historyModel.delteTrip(car_id, hisData.trip_seq);
  });

  it('delete history', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    await historyModel.delteHistory(car_id, hisData.data.colec_dt);
  });

  it('create history onoff_stat 1 to 0', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    hisData.onoff = 0;
    const result_his = await historyService.addHistory(hisData);
    expect(result_his.car_id).toEqual(car_id);
  });

  it('delete history', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    await historyModel.delteHistory(car_id, hisData.data.colec_dt);
  });

  it('create history onoff_stat 0 to 0', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    const result_his = await historyService.addHistory(hisData);
    expect(result_his.car_id).toEqual(car_id);
  });

  it('delete history', async () => {
    const car_id = await getIdByNo(hisData.car_no);
    await historyModel.delteHistory(car_id, hisData.data.colec_dt);
  });
});
