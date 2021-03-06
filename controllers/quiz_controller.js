var express = require('express');
var router = express.Router();
var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye /:quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
				where: { id: Number(quizId) },
				include: [ { model: models.Comment } ]
		}).then(
		function(quiz){
			if ( quiz ){
				req.quiz = quiz;
				next();
			} else {
				next( new Error('No existe quizId=' + quizId) );
			}
		}
	).catch(function(error){ next(error); });
};

// GET /quizes
exports.index = function(req, res){
	var search = '%'+(req.query.search||"").replace(/ /,'%')+'%';
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
		function(quizes){
			res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
		}
	).catch(function(error){ next(error); });
};

// GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show',{ quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		} 
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz =  models.Quiz.build(
			{ pregunta: "", respuesta: "", tema: ""}
		);
	res.render('quizes/new', { quiz: quiz, errors: [] });
};

// GET /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

	var errors = quiz.validate();//ya qe el objeto errors no tiene then(

	if (errors) {
		var i=0; 
		//se convierte en [] con la propiedad message por compatibilida con layout
		var errores=new Array();
		for (var prop in errors) errores[i++]={message: errors[prop]}; 
		res.render('quizes/new', { quiz: quiz, errors: errores });
	} else {
		// Guardar en BBDD los campos pregunta y respuesta de quiz
		quiz.save({ fields: ["pregunta","respuesta","tema"] }).then(function(){
			res.redirect('/quizes'); // Redireccionamiento HTTP (URl relativo) lista de preguntas
		});
	}
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz =  req.quiz;
	res.render('quizes/edit', { quiz: quiz, errors: [] });
};

// PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema      = req.body.quiz.tema;

	var errors = req.quiz.validate();//ya qe el objeto errors no tiene then(

	if (errors) {
		var i=0; 
		//se convierte en [] con la propiedad message por compatibilida con layout
		var errores=new Array();
		for (var prop in errors) errores[i++]={message: errors[prop]}; 
		res.render('quizes/edit', { quiz: req.quiz, errors: errores });
	} else {
		// Guardar en BBDD los campos pregunta y respuesta de quiz
		req.quiz.save({ fields: ["pregunta","respuesta", "tema"] }).then(function(){
			res.redirect('/quizes'); // Redireccionamiento HTTP (URl relativo) lista de preguntas
		});
	}
};

// DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};