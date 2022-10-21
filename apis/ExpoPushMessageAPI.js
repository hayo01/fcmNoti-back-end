const { Expo } = require("expo-server-sdk");
require("dotenv").config();

exports.ExpoPushMessages = (somePushTokens, data) => {
  console.log(`ExpoPushMessages > ${somePushTokens}, ${data}`);
  console.log(`token from env > ${process.env.EXPO_ACCESS_TOKEN}`);

  let messages = [];
  // for (let pushToken of somePushTokens) {
  //   if (!Expo.isExpoPushToken(pushToken)) {
  //     console.error(`Push token ${pushToken} is not a valid Expo push token`);
  //     continue;
  //   }

  console.log(`pushToken in EPMapi > ${somePushTokens}`);
  messages.push({
    to: somePushTokens,
    sound: "default",
    body: "This is test notification",
    data: { data },
  });
  // }
};
