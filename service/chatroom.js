const Chatroom = require("../model/Chatroom");

exports.findLiveChatroomListByToilet = async (
  toiletId,
  userId,
  isNullParticipant,
  populate
) => {
  let liveChatroomList;

  if (isNullParticipant) {
    liveChatroomList = await Chatroom.find({
      toilet: toiletId,
      isLive: true,
      participant: null,
    }).populate(populate);
  } else {
    liveChatroomList = await Chatroom.find({
      toilet: toiletId,
      isLive: true,
    }).populate(populate);
  }

  let myChatroom = null;

  for (let i = 0; i < liveChatroomList.length; i++) {
    if (
      String(liveChatroomList[i].owner) === String(userId) ||
      String(liveChatroomList[i].participant) === String(userId)
    ) {
      myChatroom = liveChatroomList[i];
    }
  }

  return { liveChatroomList, myChatroom };
};

exports.createChatroom = async (toiletId, userId) => {
  return await Chatroom.create({
    owner: userId,
    toilet: toiletId,
  });
};
