const {
  findLiveChatroomListByToilet,
  createChatroom,
  getChatroomById,
  getUsersLiveChatroom,
} = require("../service/chatroom");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.checkLiveChatroomList = async (req, res, next) => {
  const { toiletId, populate, isNullParticipant } = req.query;
  const userId = req.userInfo._id;

  try {
    const existingMyLiveChatroom = await getUsersLiveChatroom(userId);

    if (existingMyLiveChatroom.length) {
      const liveChatRoomData = {
        liveChatroomList: [],
        myChatroom: existingMyLiveChatroom[0],
      };

      res.json({
        result: RESPONSE_RESULT.OK,
        liveChatRoomData,
      });

      return;
    }

    const liveChatRoomData = await findLiveChatroomListByToilet(
      toiletId,
      userId,
      isNullParticipant,
      populate
    );

    res.json({
      result: RESPONSE_RESULT.OK,
      liveChatRoomData,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CHECK_LIVE_CHATROOM
      )
    );
  }
};

exports.createLiveChatroom = async (req, res, next) => {
  const { toiletId } = req.query;
  const userId = req.userInfo._id;

  try {
    const newLiveChatroom = await createChatroom(toiletId, userId);

    res.json({ result: RESPONSE_RESULT.OK, newLiveChatroom });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CREATE_CHATROOM
      )
    );
  }
};

exports.getChatroom = async (req, res, next) => {
  const { chatroomId } = req.params;

  try {
    const chatroom = await getChatroomById(chatroomId);

    res.json({ result: RESPONSE_RESULT.OK, chatroom });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_CHATROOM
      )
    );
  }
};

exports.checkUsersLiveChatroom = async (req, res, next) => {
  const userId = req.userInfo._id;
  try {
    const existingMyLiveChatroom = await getUsersLiveChatroom(userId);
    const liveChatRoomData = {
      myChatroom: existingMyLiveChatroom[0],
    };

    res.json({
      result: RESPONSE_RESULT.OK,
      liveChatRoomData,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_USERS_LIVE_CHATROOM
      )
    );
  }
};
