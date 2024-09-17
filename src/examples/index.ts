import axios from 'axios';
import { v1 as uuidV1 } from 'uuid';
// import { ENV } from '../common/config';
import { ENV, getMessenger } from '../index';
import { ISendChatMessageWanted, ISendMessage } from '../types/api/message';
import { IOnUpdate } from '../types/api/message.types';
import { DeviceTypesEnum } from '../types/types';
import { localStg } from '../utils';

const baseURL = 'http://localhost:7000';
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
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMDA5LCJ1c2VybmFtZSI6IlVtYXJiZWsiLCJmdWxsX25hbWUiOiJBS0JBUk9WIFVNQVIiLCJwaG9uZV9udW1iZXIiOiIrOTk4OTQ1NDM0NTY3IiwiZ3JvdXAiOnsiaWQiOjIsIm5hbWUiOiJBZG1pbiIsImFjY2Vzc2VzIjpbM119LCJvcmdhbml6YXRpb25faWQiOm51bGwsInNlcnZpY2VzIjpbeyJpZCI6MiwibmFtZSI6Im50ZmFjZSIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NiwibmFtZSI6InhhdGxvdiIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MTQsIm5hbWUiOiJlbWVobW9uIiwic3RhdHVzIjp0cnVlfSx7ImlkIjoxNiwibmFtZSI6ImF1dG8tdHJhbnNwb3J0Iiwic3RhdHVzIjp0cnVlfSx7ImlkIjoxOCwibmFtZSI6ImFjY2lkZW50cyIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MjAsIm5hbWUiOiJkaGEiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjIxLCJuYW1lIjoiZm9ybWExIiwic3RhdHVzIjp0cnVlfSx7ImlkIjoyMiwibmFtZSI6Iml2c3MtbWFuYWdlciIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MjcsIm5hbWUiOiJxdWljay1zZWFyY2giLCJzdGF0dXMiOnRydWV9LHsiaWQiOjI5LCJuYW1lIjoiY2FtZXJhIiwic3RhdHVzIjp0cnVlfSx7ImlkIjozMCwibmFtZSI6ImZ2diIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MzEsIm5hbWUiOiJncHMiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjMyLCJuYW1lIjoic2F5bG92Iiwic3RhdHVzIjp0cnVlfSx7ImlkIjozNCwibmFtZSI6Imxpc3RlZC1wZW9wbGUiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjM2LCJuYW1lIjoidGFkYmlyIiwic3RhdHVzIjp0cnVlfSx7ImlkIjozOCwibmFtZSI6Im10cCIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NDAsIm5hbWUiOiJjcmltZSIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NDEsIm5hbWUiOiJjYXIiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjQyLCJuYW1lIjoib3BnIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo0MywibmFtZSI6Im1pYiIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NDQsIm5hbWUiOiJzZXJ2aWNlIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo0NSwibmFtZSI6Im5vdGlmaWNhdGlvbnMiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjQ2LCJuYW1lIjoidGVlbmFnZXJzIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo0NywibmFtZSI6ImJ1cy1wYXJraW5nIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo0OCwibmFtZSI6ImRldGVjdG9yIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo0OSwibmFtZSI6ImFkZC1jYW1lcmEiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjUwLCJuYW1lIjoiaXZzcy1jb250cm9sIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo1MSwibmFtZSI6IjV0YXNoYWJidXMiLCJzdGF0dXMiOnRydWV9LHsiaWQiOjUyLCJuYW1lIjoibG9nZ2VyIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo1MywibmFtZSI6InNjbyIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NTQsIm5hbWUiOiJsYW5ndWFnZSIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NTUsIm5hbWUiOiJzdXBlcnZpc29yIiwic3RhdHVzIjp0cnVlfSx7ImlkIjo1NywibmFtZSI6Im15LWluc3BlY3RvciIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NTksIm5hbWUiOiJib2R5LWNhbWVyYSIsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NjAsIm5hbWUiOiJlbWlncmFudCIsInN0YXR1cyI6dHJ1ZX1dLCJkaXN0cmljdElkIjpudWxsLCJoYXNoIjoiYTNjZDk0MDQ1N2EwZjA0ZGE5ZDQ1ZDY4MDRjMDM3Y2UifSwiaWF0IjoxNzI1OTcxNzQxLCJleHAiOjE3MjYwNTgxNDF9.vDkyGh1OJeiOHFWE-PNoYUrJoi5DAZgKdSIxkeapuso';
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
    console.log('disconnect', reason);
  })
  .on('pong', () => {
    console.log('pong');
  })
  .on('update', (data: IOnUpdate) => {
    console.log(data._id, 'update');
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
      to: { chatType: 'private', chatId: chatId },
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
      to: { chatType: 'private', chatId: chatId },
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
