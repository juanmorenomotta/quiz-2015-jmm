var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

/* GET /autor. */
router.get('/autor', function(req, res) {
  res.render('autor', { title: 'Autor', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId',                       quizController.load );

// Definicion de rutas de /quizes
router.get('/quizes',                        quizController.index);
router.get('/quizes/:quizId(\\d+)',          quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer);
router.get('/quizes/new',                    quizController.new);
router.post('/quizes/create',                quizController.create);
router.put('/quizes/:quizId(\\d+)',          quizController.update);
router.get('/quizes/:quizId(\\d+)/edit',     quizController.edit);
router.delete('/quizes/:quizId(\\d+)',       quizController.destroy);

module.exports = router;
