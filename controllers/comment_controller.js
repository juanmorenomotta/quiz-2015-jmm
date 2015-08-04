var express = require('express');
var router = express.Router();
var models = require('../models/models.js');

// autoload :id de comentarios
exports.load = function(req, res, next, commentId){
	models.Comment.find({
		where: {id: Number(commentId)}
	}).then( 
	function(comment){
		if (comment){
			req.comment = comment;
			next();
		} else { 
			next( new Error('No existe commentId=' + commentId ) );
		}
	}).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res	){
	res.render('comments/new.ejs', { quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build(
		{ 	texto: req.body.comment.texto,
			QuizId: req.params.quizId
		});

	var errors = comment.validate();

	if (errors) {
		var i=0; 
		//se convierte en [] con la propiedad message por compatibilida con layout
		var errores=new Array();
		for (var prop in errors) errores[i++]={message: errors[prop]}; 
		res.render('comments/new.ejs', 
			{ comment: comment, quizid: req.params.quizId, errors: errores });
	} else {
		// Guardar en BBDD los campos pregunta y respuesta de comment
		comment.save().then(function(){
			res.redirect('/quizes/'+req.params.quizId); // Redireccionamiento HTTP (URl relativo) lista de preguntas
		});
	}			
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = 1;

	req.comment.save({ fields: ["publicado"] })
	.then( function(){ res.redirect('/quizes/'+req.params.quizId); })
	.catch(function(error){next(error)});
};

