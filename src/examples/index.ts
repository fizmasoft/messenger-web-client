import axios from 'axios';
import { v1 as uuidV1 } from 'uuid';
import { ENV } from '../common/config';
import { getMessenger } from '../index';
import { localStg } from '../utils';

const baseURL = 'http://localhost:3000';
const localUid = localStg.get('uid');
const uid = localUid ? localUid : uuidV1();
localStg.set('uid', uid);

const chatId = '66a8daaa56cc0c0114084b23'; // ! rm

let languageGetter = () => 'Uz-Uz-Latin';
let appVersion = '0.0.0';

const requiredHeaders = {
  'x-device-type': 'web',
  'x-device-model': ENV.isBrowser
    ? `${navigator.userAgent} | ${navigator.platform}`
    : ENV.isNode
    ? `${process.platform} | ${process.arch} | Nodejs: ${process.version}`
    : 'Unknown', // dynamically fetching device model info
  'x-app-lang': languageGetter() || 'Uz-Latin', // dynamically fetching language info
  'x-app-version': appVersion,
  'x-app-uid': uid,
};

const messenger = getMessenger({
  baseURL,
  languageGetter() {
    return 'Uz-Latin';
  },
  token: async (): Promise<{
    access: string;
    refresh: string;
  }> => {
    const res = await axios.post(
      `${baseURL}/v1/auth/login`,
      {
        username: 'Umarkhan', // Adhamjon, Umarkhan
        password: '123',
      },
      {
        headers: requiredHeaders,
      },
    );

    return {
      access: res.data.data.token.accessToken,
      refresh: res.data.data.token.refreshToken,
    };
  },
  polling: { interval: 5_000, limit: 100 },
});

console.log('Success started');

messenger
  .on('connect', (...args) => {
    console.log('connected', args);
  })
  .on('reconnect_attempt', (...args) => {
    console.log('reconnect_attempt', args);
  })
  .on('reconnect', (...args) => {
    console.log('reconnect', args);
  })
  .on('disconnect', (reason, details) => {
    console.log('disconnect', reason);
  })
  .on('pong', () => {
    console.log('pong');
  })
  .on('update', (data: Messenger.IOnUpdate) => {
    console.log(data._id, 'update');
  })
  .on('chatAction', (action) => {
    console.log(action, 'chatAction');
  });

const getRadomNumber = (from: number, to: number) => from + Math.round(Math.random() * (to - from));

setInterval(async () => {
  let message: ApiMessageManagement.ISendMessage;
  const random = getRadomNumber(0, 100);
  // const random = 3;
  if (random % 2 === 0) {
    message = {
      messageType: 'text',
      to: { chatType: 'private', chatId: chatId },
      text: `Test xabar ${Math.random() * 100}. Time: ${new Date().toISOString()}`,
    };
  } else {
    const wanted: ApiMessageManagement.IChatMessageWanted = {
      type: 'user',
      title: 'MVD-Qidiruv',
      user: {
        firstName: 'Qumriniso',
        image: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        // fullImage: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG',
        lastName: 'Qambarov',
        middleName: 'Qulmiddin qizi',
        fullName: 'Qambarov Qumriniso Qulmiddin qizi',
        pAddress: 'Qashqadaryo Viloyat, Kitob Tuman, Qashqir qishloq',
        passport: 'AA8432720',
        birthDate: '19.05.1981',
      },
      car: { carImage: 'http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG', carNumber: '01O010OO' },
      images: ['http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG'],
      // fullImages: ['http://localhost:3000/v1/files/profile_photos/d1df88dc-62b6-4ba7-9a5f-9669be9040a3.JPEG'],
      initiator: 'ЖАЛАКУДУКСКИЙ РОВД',
      address: 'Туркистон кўчаси, Dehqon bozori',
      text: `Test xabar ${Math.random() * 100}. Time: ${new Date().toISOString()}`,

      mera: 'АРЕСТ',
      region: 'ОЛМАЛИК ШАҲРИ',
      statya: '139 ч.3 п.А;140 ч.1',
      rozType: 'МЕЖГОСУДАРСТВЕННЫЙ Р',
      sender: {
        firstName: 'MAMURAXON',
        lastName: 'ASADOVA',
        middleName: 'CHIRMASHEVNA',
        fullName: 'ASADOVA MAMURAXON CHIRMASHEVNA',
      },
      location: [40.84764631407434, 69.61757628864146],
      // fullImage: 'ivss_images/full_image_0ab1cece-d8bc-42ea-af6a-067206810dbd.jpg',
      // takenImage: 'ivss_images/taken_image_47fbc602-65ea-460a-bbd8-051c9df946f0.jpg',
      objectName: 'Дехқон бозори',
      wantedDate: new Date('07.31.2019').toISOString(),
    };
    if (random % 3 === 0) {
      wanted.user = null;
      wanted.type = 'car';
    } else {
      wanted.car = null;
    }

    message = {
      messageType: 'wanted',
      to: { chatType: 'private', chatId: chatId },
      wanted: wanted,
      text: null,
    };
  }

  await messenger
    .sendMessage(message)
    .then((res) => {
      console.log(res, 'Success sended');
      return res.data;
    })
    .catch((err) => {
      console.log(err, 'err');
    });
}, 1_000);
// (async () => {
//   const updates = await messenger.getUpdates();
//   console.log(updates);
// })();
// setInterval(() => {
//   const time = new Date().toISOString();
//   console.log('ping', time);

//   messenger.socket.send('hello');
//   messenger.socket.emit('ping', time);
// }, 1000);
