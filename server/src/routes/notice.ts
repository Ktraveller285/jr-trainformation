import { Router } from 'express';
// データベース接続を初期化

const noticeRouter = Router();

/**
 * POST /api/notice/register
 * 通知を登録するためのAPIですけど…
 */
noticeRouter.post('/register', async (req, res) => {
  /*
  try {
    let item = await NoticeRepository.save({
      noticeEmail: req.body.noticeEmail || null,
      lineName: req.body.lineName || null,
      trainNumber: req.body.trainNumber || null,
      noticeDate: req.body.noticeDate || null,
      cancelDecisionTime: req.body.cancelDecisionTime || null,
      ipAddress:
        req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
    });
    res.send({ item });
    console.log(item);
  } catch (e: any) {
    res.status(400).send(e.toString());
  }*/
});

export default noticeRouter;
