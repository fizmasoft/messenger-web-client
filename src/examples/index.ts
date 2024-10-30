import axios from 'axios';
import { v1 as uuidV1 } from 'uuid';
// import { ENV } from '../common/config';
import { ENV, getMessenger } from '../index';
import { ISendChatMessageWanted, ISendMessage } from '../types/api/message';
import { IOnUpdate } from '../types/api/message.types';
import { DeviceTypesEnum } from '../types/types';
import { localStg } from '../utils';

const baseURL = 'https://navoiy.safecity.uz/connect/api/';
// const baseURL = 'http://localhost:7000';
const localUid = localStg.get('messengerDeviceUid');
const uid = localUid ? localUid : uuidV1();
localStg.set('messengerDeviceUid', uid);

const chatId = '66cc25d3c1875cfa0dddfa20'; // ! rm
let appVersion = '1.0.0';

const apiKey = 'qalqon';
const apiHash = '66b3576d917425b29a3e3644';

const messenger = getMessenger({
  baseURL,
  apiKey,
  apiHash,
  languageGetter() {
    return 'Uz-Latin';
  },
  token: async (): Promise<{
    access: string;
    refresh: string;
  }> => {
    const token = process.env.TOKEN;
    const { data } = await axios.create({ baseURL }).get(`/v1/auth/me-from?token=${token}`, {
      headers: {
        Authorization: `Basic ${btoa(`${apiKey}:${apiHash}`)}`,
        'x-device-type': DeviceTypesEnum.WEB,
        'x-app-lang': 'Uz-Latin',
        'x-device-model': ENV.isBrowser
          ? `${navigator.userAgent} | ${navigator.platform}`
          : ENV.isNode
            ? `${process.platform} | ${process.arch} | Nodejs: ${process.version}`
            : 'Unknown', // dynamically fetching device model info
        // 'x-app-lang': (languageGetter() || 'Uz-Latin') as I18nType.LangType, // dynamically fetching language info
        'x-app-version': appVersion,
        'x-app-uid': uid,
      },
    });
    console.log(data);

    return {
      access: data.data.token.accessToken,
      refresh: data.data.token.refreshToken,
    };
    // const res = await axios.post(
    //   `${baseURL}/v1/auth/login`,
    //   {
    //     username: 'Umarkhan', // Adhamjon, Umarkhan
    //     password: '123',
    //   },
    //   {
    //     headers: requiredHeaders,
    //   },
    // );

    // return {
    //   access: res.data.data.token.accessToken,
    //   refresh: res.data.data.token.refreshToken,
    // };
  },
  socket: { baseUrl: `https://navoiy.safecity.uz/`, path: '/connect/api/socket.io/messenger' }
  // polling: { interval: 5_000, limit: 100 },
});

console.log('Success started');

messenger
  .on('connect', ({ message, socket }) => {
    console.log('connected', message, socket.id);
  })
  .on('reconnect_attempt', (...args) => {
    console.log('reconnect_attempt', args);
  })
  .on('reconnect', (...args) => {
    console.log('reconnect', args);
  })
  .on('disconnect', ({ reason, details }) => {
    console.log('disconnect', reason, details);
    setTimeout(() => {
      console.log(messenger.socket.connected, messenger.socket.disconnected, 1);

      messenger.socket.connect();
    }, 5000);
  })
  .on('pong', () => {
    console.log('pong');
  })
  .on('update', (data: IOnUpdate) => {
    console.log('data', data, 'update');
  })
  .on('chatAction', (action) => {
    console.log(action, 'chatAction');
  })
  .on('socketConnectionError', (err) => {
    console.log(err);
  });

const getRadomNumber = (from: number, to: number) => from + Math.round(Math.random() * (to - from));

(async () => {
  let message: ISendMessage;
  const random = getRadomNumber(0, 100);
  // const random = 3;
  if (random % 2 === 0) {
    message = {
      messageType: 'text',
      // to: { chatType: 'private', chatId: chatId },
      text: `Test xabar ${Math.random() * 100}. Time: ${new Date().toISOString()}`,
    };
  } else {
    const wanted: ISendChatMessageWanted = {
      type: 'user',
      title: 'MVD-Qidiruv',
      databaseName: 'MVD-Qidiruv',
      pUser: {
        image:
          'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        // fullImage: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        fullName: 'Qambarov Qumriniso Qulmiddin qizi',
        address: 'Qashqadaryo Viloyat, Kitob Tuman, Qashqir qishloq',
        passport: 'AA8432720',
        birthDate: '19.05.1981',
      },
      wantedUser: {
        image:
          'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        // fullImage: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        fullName: 'Qambarov Qumriniso Qulmiddin qizi',
        address: 'Qashqadaryo Viloyat, Kitob Tuman, Qashqir qishloq',
        passport: 'AA8432720',
        birthDate: '19.05.1981',
      },
      car: {
        carImage:
          'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        carNumber: '01O010OO',
      },
      takenImage:
        'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
      fullImage:
        'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
      initiator: 'ЖАЛАКУДУКСКИЙ РОВД',
      address: 'Туркистон кўчаси, Dehqon bozori',
      text: `Test xabar ${Math.random() * 100}. Time: ${new Date().toISOString()}`,

      mera: 'АРЕСТ',
      region: 'ОЛМАЛИК ШАҲРИ',
      statya: '139 ч.3 п.А;140 ч.1',
      rozType: 'МЕЖГОСУДАРСТВЕННЫЙ Р',
      location: [40.84764631407434, 69.61757628864146],
      // fullImage: 'ivss_images/full_image_0ab1cece-d8bc-42ea-af6a-067206810dbd.jpg',
      // takenImage: 'ivss_images/taken_image_47fbc602-65ea-460a-bbd8-051c9df946f0.jpg',
      objectName: 'Дехқон бозори',
      wantedDate: new Date('07.31.2019').toISOString(),
    };
    if (random % 3 === 0) {
      wanted.pUser = null;
      wanted.wantedUser = null;
      wanted.type = 'car';
    } else {
      wanted.car = null;
    }

    message = {
      messageType: 'wanted',
      // to: { chatType: 'private', chatId: chatId },
      wanted: wanted,
      text: null,
    };
  }

  await new Promise((res) => messenger.on('connect', res));

  // await messenger
  //   .sendMessage(message)
  //   .then((res) => {
  //     console.log(res, 'Success sended');
  //     return res.data;
  //   })
  //   .catch((err) => {
  //     console.log(err.response?.data, 'err');
  //   });
})();
