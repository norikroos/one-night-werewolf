import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

interface StringKeyObject {
  // string
  [key: string]: any;
}

export const startDiscussion = functions
  .region("asia-northeast1")
  .firestore.document("rooms/{roomId}/actionDatas/{userId}")
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const roomId = context.params.roomId;
    const promise1 = fetchRoomInfo(roomId);
    const promise2 = fetchActionDatas(roomId);
    const [roomData, actionDatas] = await Promise.all([promise1, promise2]);

    if (roomData.state !== 1) return;

    const allUserCount = Object.keys(actionDatas).length;
    const finishUserCount = Object.values(actionDatas).filter(
      (d) => d.finishAction
    ).length;

    if (finishUserCount === allUserCount) {
      // finishAction = true のユーザー数と全体ユーザー数が一致したら議論を開始する
      console.log("finish all action. start updateing room state.");
      await firestore.collection("rooms").doc(roomId).update({
        state: 2,
      });
    } else {
      console.log(`wait user action. ${finishUserCount} user finished.`);
    }
  });

export const showResult = functions
  .region("asia-northeast1")
  .firestore.document("rooms/{roomId}/actionDatas/{userId}")
  .onUpdate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const roomId = context.params.roomId;
    const promise1 = fetchRoomInfo(roomId);
    const promise2 = fetchActionDatas(roomId);
    const [roomData, actionDatas] = await Promise.all([promise1, promise2]);

    if (roomData.state !== 3) return;

    const allUserCount = Object.keys(actionDatas).length;
    const finishUserCount = Object.values(actionDatas).filter(
      (d) => d.voteUserId
    ).length;

    if (finishUserCount === allUserCount) {
      // finishAction = true のユーザー数と全体ユーザー数が一致したら議論を開始する
      console.log("finish voting all user. start updateing room state.");
      await firestore.collection("rooms").doc(roomId).update({
        state: 4,
      });
    } else {
      console.log(`wait user voting. ${finishUserCount} user finished.`);
    }
  });

export const fetchJoinUsers = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;
    if (!roomId || !userId) throw new Error("invalid request");

    console.log(roomId);
    const res = fetchRoomUsers(roomId).then((users) => {
      if (!users[userId]) throw new Error("invarid request");
      return users;
    });
    console.log(res);

    return res;
  });

const fetchRoomInfo = async (roomId: string) => {
  const doc = await firestore.collection("rooms").doc(roomId).get();
  const result: StringKeyObject = { id: doc.id, ...doc.data() };
  return result;
};

const fetchRoomUsers = async (roomId: string) => {
  const querySnapshot = await firestore
    .collection("users")
    .where("joinRooms", "array-contains", roomId)
    .get();
  const joinUsers: StringKeyObject = {};
  querySnapshot.forEach((doc) => {
    joinUsers[doc.id] = doc.data();
  });
  return joinUsers;
};

export const createRoom = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    const userId = context.auth?.uid;
    if (!userId) throw new Error("invalid request");
    console.log(context.auth);
    console.log(userId);
    const name = data.name;
    const roomData = {
      name,
      count: 0,
      state: 0,
      selectedRoles: [
        "werewolf",
        "werewolf",
        "fortune-teller",
        "phantom-thief",
        "villager",
      ],
      createdBy: userId,
      createdAt: new Date(),
    };
    let roomId = "";
    const res = firestore
      .collection("rooms")
      .add(roomData)
      .then((room) => {
        console.log("create rooms", room);
        roomId = room.id;
        return setRoomToUser(roomId, userId);
      })
      .then(() => roomId);
    return res;
  });

export const joinRoom = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;

    if (!roomId || !userId) throw new Error("invalid request");

    const promise1 = fetchRoomUsers(roomId);
    const promise2 = fetchRoomInfo(roomId);

    const [joinUsers, roomData] = await Promise.all([promise1, promise2]);
    console.log(roomData);
    if (!Object.keys(roomData).includes("state")) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "ルームIDが不正です"
      );
    }
    if (!joinUsers[userId] && roomData.state > 0) {
      // https://cloud.google.com/apis/design/errors?hl=ja#http_mapping
      throw new functions.https.HttpsError(
        "failed-precondition",
        "指定されたルームはゲーム進行中です"
      );
    }
    await setRoomToUser(roomId, userId);
    return roomId;
  });

const setRoomToUser = (roomId: string, userId: string) => {
  return firestore
    .collection("users")
    .doc(userId)
    .update({
      joinRooms: admin.firestore.FieldValue.arrayUnion(roomId),
    });
};

/**
 * ゲームを開始する
 * - selectedRolesからランダムに抽出しactionDatas.beforeRoleにセット
 * - state=1を設定
 * - selectedRolesを登録
 */
export const startGame = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;
    const selectedRoles = data.selectedRoles;

    if (!roomId || !userId) throw new Error("invalid request");

    const promise1 = fetchRoomUsers(roomId);
    const promise2 = fetchRoomInfo(roomId);

    const [joinUsers, roomData] = await Promise.all([promise1, promise2]);
    if (!joinUsers || !roomData) throw new Error("invalid roomId");
    if (!joinUsers[userId] || roomData.state !== 0)
      throw new Error("invalid request");
    const shuffledRoles = shuffle(selectedRoles);
    const promises = Object.keys(joinUsers).map(
      (uid: string, index: number) => {
        return firestore
          .collection("rooms")
          .doc(roomId)
          .collection("actionDatas")
          .doc(uid)
          .set({
            beforeRole: shuffledRoles[index],
            afterRole: shuffledRoles[index],
            selectUserId: "",
            voteUserId: "",
            finishAction: false,
          });
      }
    );
    await Promise.all(promises);
    await firestore
      .collection("rooms")
      .doc(roomId)
      .update({
        state: 1,
        count: admin.firestore.FieldValue.increment(1),
        selectedRoles,
      });
    return true;
  });

// Fisher-Yatesのシャッフル
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// ロールデータを取得
const fetchActionDatas = async (roomId: string) => {
  return firestore
    .collection("rooms")
    .doc(roomId)
    .collection("actionDatas")
    .get()
    .then((querySnapshot) => {
      const roleDatas: StringKeyObject = {};
      querySnapshot.forEach((doc) => {
        roleDatas[doc.id] = doc.data();
      });
      return roleDatas;
    });
};

export const fetchAssignedRoles = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;
    const selectUserId = data.selectUserId;
    if (!roomId || !userId) throw new Error("invalid request");

    const promise1 = fetchRoomInfo(roomId);
    const promise2 = fetchActionDatas(roomId);

    const [roomInfo, roleDatas] = await Promise.all([promise1, promise2]);
    let targetId = roleDatas[userId].selectUserId;
    console.log(selectUserId);

    if (!targetId && selectUserId) {
      targetId = selectUserId; // 既にアクション済みでなければターゲットに代入
      await firestore
        .collection("rooms")
        .doc(roomId)
        .collection("actionDatas")
        .doc(userId)
        .update({ selectUserId }); // 選択ユーザーを更新

      roleDatas[userId] = { ...roleDatas[userId], selectUserId };
    }
    console.log(targetId);
    console.log(roleDatas);

    const resultRoleDatas: StringKeyObject = {
      [userId]: { ...roleDatas[userId], afterRole: "" }, // 自分の役職はデフォルトでセット
    };

    console.log(roleDatas);

    if (roleDatas[userId].beforeRole === "fortune-teller") {
      if (targetId !== userId && roleDatas[targetId]) {
        resultRoleDatas[targetId] = {
          beforeRole: roleDatas[targetId].beforeRole,
        };
      } else if (targetId === "others") {
        // ユーザーが指定されていない場合は場の残りのカードをNoUserとしてセットして返す
        const assignedRoles = Object.values(roleDatas).map((d) => d.beforeRole); // 既に割当済みの役職リスト
        const notAssignedRoles = roomInfo.selectedRoles;

        assignedRoles.forEach((r) => {
          const index = notAssignedRoles.indexOf(r);
          if (index !== -1) {
            notAssignedRoles.splice(index, 1); // 割当済みの役職を削除していく
          }
        });

        notAssignedRoles.forEach((beforeRole: string, index: number) => {
          resultRoleDatas[`NoUser${index + 1}`] = { beforeRole };
        });
      }
    }
    if (roleDatas[userId].beforeRole === "phantom-thief") {
      if (targetId !== userId && roleDatas[targetId]) {
        resultRoleDatas[targetId] = {
          beforeRole: roleDatas[targetId].beforeRole,
        };
        const collection = firestore
          .collection("rooms")
          .doc(roomId)
          .collection("actionDatas");
        const userUpdate = collection
          .doc(userId)
          .update({ afterRole: roleDatas[targetId].beforeRole });
        const targetUpdate = collection
          .doc(targetId)
          .update({ afterRole: roleDatas[userId].beforeRole });
        await Promise.all([userUpdate, targetUpdate]);
      }
    }
    if (roleDatas[userId].beforeRole === "werewolf") {
      if (targetId) {
        Object.keys(roleDatas).forEach((uid) => {
          if (uid !== userId && roleDatas[uid].beforeRole === "werewolf") {
            resultRoleDatas[uid] = { beforeRole: roleDatas[uid].beforeRole }; // afterRoleが交換されている場合があるので隠す
          }
        });
      }
    }

    return resultRoleDatas;
  });

export const finishRoleAction = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;
    if (!roomId || !userId) throw new Error("invalid request");
    const updateData = {
      finishAction: true,
    };
    return firestore
      .collection("rooms")
      .doc(roomId)
      .collection("actionDatas")
      .doc(userId)
      .update(updateData)
      .then(() => {
        return updateData;
      });
  });

export const finishDiscussion = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;
    if (!roomId || !userId) throw new Error("invalid request");
    const joinUsers = await fetchRoomUsers(roomId);
    if (!joinUsers || !joinUsers[userId]) throw new Error("invalid request");
    return firestore.collection("rooms").doc(roomId).update({ state: 3 });
  });

// 処刑する人を登録
export const executeUser = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;
    const selectUserId = data.selectUserId;
    if (!roomId || !userId || !selectUserId) throw new Error("invalid request");
    const updateData = { voteUserId: selectUserId };
    return firestore
      .collection("rooms")
      .doc(roomId)
      .collection("actionDatas")
      .doc(userId)
      .update(updateData)
      .then(() => {
        return updateData;
      });
  });

export const fetchResult = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;

    if (!roomId || !userId) throw new Error("invalid request");

    const roomInfo = await fetchRoomInfo(roomId);
    if (roomInfo.state !== 4) throw new Error("invalid request");

    const result = await fetchActionDatas(roomId);

    return result;
  });

export const resetGame = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    const userId = context.auth?.uid;
    const roomId = data.roomId;

    if (!roomId || !userId) throw new Error("invalid request");

    const joinUsers = await fetchRoomUsers(roomId);
    if (!joinUsers || !joinUsers[userId]) throw new Error("invalid request");

    return firestore.collection("rooms").doc(roomId).update({ state: 0 });
  });
