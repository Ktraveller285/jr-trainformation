import { Router } from 'express';
import { Notice } from '../interfaces/notice.interface';
const { getFirestore } = require('firebase-admin/firestore');

const noticeRouter = Router();

/**
 * POST /api/notice/register
 * 通知を登録するためのAPIですけど…
 */
noticeRouter.post('/register', async (req, res) => {
  // データベースと接続
  const db = getFirestore();

  try {
    // 通知のデータを作成
    const data: Notice = {
      noticeEmail: req.body.noticeEmail || null,
      lineName: req.body.lineName || null,
      trainNumber: req.body.trainNumber || null,
      noticeDate: req.body.noticeDate || null,
      cancelDecisionTime: req.body.cancelDecisionTime || null,
      ipAddress:
        req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress!,
      notified: false,
    };

    // データベースに通知を登録
    const dbResult = await db.collection('notifydata').add(data);

    // 結果をクライアントへ返す
    res.send({ dbResult });
    console.log('通知を登録しました', data);
  } catch (e: any) {
    res.status(400).send(e.toString());
  }
});

export default noticeRouter;
