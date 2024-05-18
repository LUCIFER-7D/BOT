module.exports = {
config:{
  name: "download",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "Senayel",
  description: "Social Media Video Downloader",
  category: "user",
  usages: [
    "/download [Facebook video link]",
    "/download [TikTok video link]",
    "/download [YouTube video link]",
    "/download [Instagram video link]",
  ],
  cooldowns: 5,
  dependencies: {
        'senayel-media-downloader': '',
  }
},

  languages: {
    "vi": {},
        "en": {
            "urlinvalid": 'Unsupported video platform. Please provide a valid Facebook, TikTok, Twitter, Instagram, or YouTube video link.',
          "waitfb": 'Downloading Facebook video. Please wait...',
          "downfb": "Download Facebook Video Successfully",
          "waittik": 'Downloading TikTok video. Please wait....!',
          "waitinsta": 'Downloading Instagram video. Please wait...',
          "downinsta": 'Instagram video downloadsuccess',
          "waityt": 'Downloading YouTube video. Please wait...',
          "waittw": 'Downloading Twitter video. Please wait...',
          "downtw": 'Twitter video download success',
          "error": '❌Error'
        }
    },

start: async function ({ senayel, events, args, lang }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const content = args.join(" ");
  const { ytdown, ndown, tikdown, twitterdown } = require("senayel-media-downloader")
  let msg = "";

  const sendWaitingMessage = async (message) => {
    const vid = (
      await axios.get(
        'https://i.imgur.com/rvreDPU.gif',
        { responseType: 'stream' }
      )
    ).data;
    return await senayel.sendMessage({ ...message }, events.threadID);
  };

  if (content.includes("https://fb.watch/") || content.includes("https://www.facebook.com")) {
    const fbsenayelResponse = await ndown(content);
    console.log(fbsenayelResponse)
    const fbVideoUrl = fbsenayelResponse.data[0].url;
    const waitingMessage = await sendWaitingMessage({ body: lang("waitfb") });

    const fbVideoData = (await axios.get(fbVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/fbVideo.mp4", Buffer.from(fbVideoData, "utf-8"));

    msg = lang("downfb");

    senayel.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/fbVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      senayel.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (
    content.includes("https://vt.tiktok.com/") ||
    content.includes("https://tiktok.com/") ||
    content.includes("https://www.tiktok.com")
  ) {
    const tiktoksenayelResponse = await tikdown(content);
    const tiktokVideoUrl = tiktoksenayelResponse.data.video;
    const tiktokTitle = tiktoksenayelResponse.data.title;
    const tiktokavatar = tiktoksenayelResponse.data.author.avatar;
    console.log(tiktoksenayelResponse)
    const tiktokAvatar = (
      await axios.get(`${tiktokavatar}`,
        { responseType: 'stream' }
      )
    ).data;
    const waitingMessage = await sendWaitingMessage({ body: lang("waittik")});

    const tiktokVideoData = (await axios.get(tiktokVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/tiktokVideo.mp4", Buffer.from(tiktokVideoData, "utf-8"));

    msg = `《TITLE》${tiktokTitle}`;

    senayel.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/tiktokVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      senayel.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (content.includes("https://instagram.com") || content.includes("https://www.instagram.com")) {
    const instagramsenayelResponse = await ndown(content);
    const instagramVideoUrl = instagramsenayelResponse.data[0].url;
    const waitingMessage = await sendWaitingMessage({ body: lang("waitinsta") });

    const instagramVideoData = (await axios.get(instagramVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/instagramVideo.mp4", Buffer.from(instagramVideoData, "utf-8"));

    msg = lang("downinsta");

    senayel.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/instagramVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      senayel.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (content.includes("https://youtube.com/shorts/") || content.includes("https://youtu.be/")) {
    // YouTube video download logic
    const youtubesenayelResponse = await ytdown(content);
    const youtubeVideoUrl = youtubesenayelResponse.data.video;
    const title = youtubesenayelResponse.data.title;
    const waitingMessage = await sendWaitingMessage({ body: lang("waityt") });
    const youtubeVideoData = (await axios.get(youtubeVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/youtubeVideo.mp4", Buffer.from(youtubeVideoData, "utf-8"));

    msg = `${title}`;

    senayel.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/youtubeVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      senayel.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else if (content.includes("https://twitter.com/")) {
    const instagramsenayelResponse = await twitterdown(content);
    const twitterVideoUrl = instagramsenayelResponse.data.HD;
    const waitingMessage = await sendWaitingMessage({ body: lang("waittw") });

    const TWITTEEVideoData = (await axios.get(twitterVideoUrl, {
      responseType: "arraybuffer",
    })).data;
    fs.writeFileSync(__dirname + "/cache/instagramVideo.mp4", Buffer.from(TWITTEEVideoData, "utf-8"));

    msg = lang("downtw");

    senayel.reply(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/instagramVideo.mp4"),
      },
      events.threadID
    );

    setTimeout(() => {
      senayel.unsendMessage(waitingMessage.messageID);
    }, 9000);
  } else {
    msg = lang("urlinvalid");
    senayel.reply({ body: msg }, events.threadID);
  }
}
}
