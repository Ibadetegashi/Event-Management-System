const router = require('express').Router();
const {
  participantRegister,
  getAllParticipants,
  getParticipantById,
  getParticipantsByEvent,
  editParticipant,
  deleteParticipant,
  removeParticipantFromSpecificEvent,
} = require('../controllers/participant');

const {
  registerParticipantValidator,
  editParticipantValidator,
} = require('../validators/participantValidator');

const errorHandle = require('../middlewares/errorHandle');

router.post(
  '/',
  registerParticipantValidator,
  errorHandle,
  participantRegister,
);
router.put(
  '/:id',
  editParticipantValidator,
  errorHandle,
  editParticipant,
);
router.get('/', getAllParticipants);
router.put('/remove/:participantId', removeParticipantFromSpecificEvent)
router.get('/:id', getParticipantById);
router.get('/event/:eventId', getParticipantsByEvent);
router.delete('/:id', deleteParticipant);

module.exports = router;
