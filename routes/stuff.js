const express = require('express');
const router = express.Router();

const stuffController = require('../controllers/stuff');
const auth = require('../middleware/auth');

router.post('/', auth, stuffController.createThing);
router.put('/:id', auth, stuffController.modifyThing);
router.delete('/:id', auth, stuffController.deleteThing);
router.get('/:id', auth, stuffController.getOneThing);
router.get('/', auth, stuffController.getAllThings);

module.exports = router;