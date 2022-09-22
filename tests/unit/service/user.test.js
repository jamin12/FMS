const userService = require('../../../src/services/user.service');
const userDetailService = require('../../../src/services/user.detail.service');
const pick = require('../../../src/utils/pick');

describe('user test', () => {
  const user = {
    email: 'test1234@test.com',
    password: `qewr1234`,
    username: `min`,
    details: {
      name: `hihi`,
      mobile: `010-1234-5678`,
      gender: 0,
      memo: `testing`,
    },
    role: `admin`,
  };

  beforeAll(async () => {
    const result_user = await userService.getUserByEmail(user.email);
    if (result_user) {
      await userService.deleteUserById(result_user.id);
    }
  });

  it('create a user', async () => {
    const result_user = await userService.createUser(user);
    expect(result_user.email).toEqual(user.email);
  });

  it('create a user "Email already take"', async () => {
    await userService.createUser(user).catch((e) => {
      expect(e.message).toBe('Email already taken');
    });
  });

  it('update "Email already taken"', async () => {
    const result_user = await userService.getUserByEmail(user.email);
    await userService.updateUserById(result_user.id,user).catch((e) => {
      expect(e.message).toBe('Email already taken');
    });
  });

  it('update "Mobile already taken"', async () => {
    const result_user = await userService.getUserByEmail(user.email);
    user.email = "qwer1234@gmail.com";
    await userService.updateUserById(result_user.id,user).catch((e) => {
      expect(e.message).toBe('Mobile already taken');
    });
  });

  it('update "Mobile already taken"', async () => {
    const result_user = await userService.getUserByEmail(user.email);
    const pick_user = pick(user,['username', 'details'])
    const updated_user = await userService.updateUserById(result_user.id,pick_user)
    expect(updated_user.email).toBe(user.email);
  });

  it('delete a user ', async () => {
    const result_user = await userService.getUserByEmail(user.email);
    const deleted_user = await userService.deleteUserById(result_user.id);
    expect(deleted_user.email).toEqual(user.email);
  });

  it('delete "User not found"', async () => {
    const result_user = await userService.getUserByEmail(user.email);
    await userService.deleteUserById(result_user).catch((e) => {
      expect(e.message).toBe('User not found');
    });
  });

  it('update "User not found"', async () => {
    const result_user = await userService.getUserByEmail(user.email);
    await userService.updateUserById(result_user,user).catch((e) => {
      expect(e.message).toBe('User not found');
    });
  });
});
