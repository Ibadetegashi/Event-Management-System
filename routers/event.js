const router = require('express').Router();
const {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventsByParticipant,
  searchEvent,
} = require('../controllers/event');

const {
  createEventValidator,
  editEventValidator,
} = require('../validators/eventValidator');

const errorHandle = require('../middlewares/errorHandle');
const uploading = require('../middlewares/upload');

router.post(
  '/',
  uploading,
  createEventValidator,
  errorHandle,
  createEvent,
);
router.put(
  '/:id',
  uploading,
  editEventValidator,
  errorHandle,
  editEvent,
);
router.delete('/:id', deleteEvent);
router.get('/search', searchEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get(
  '/participant/:participantId',
  getEventsByParticipant,
);
module.exports = router;
