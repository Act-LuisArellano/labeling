const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const Asignation = require('../models/Asignation');
const Card = require('../models/Card');
const Label = require('../models/Label');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes', isAuthenticated , async (req, res)=>{
    const asignation = await Asignation.findById(req.user.asignation);
    const cards = await Card.find({_id:{$in:asignation.ids_ejemplo.split(',')}}).lean();
    const userid= req.user.id;
    const ids = [];
    cards.forEach((card)=>{
        ids.push(card._id);
    });
    const p_label = await Label.find({
        '$and':[
            {'id_ejemplo': {$in: ids}},
            {'id_user': userid}
    ]});
    const ids_ejemplos=[];
    p_label.forEach((label)=>{
        ids_ejemplos.push(label.id_ejemplo);
    });

    res.render('notes/all-notes', {cards,ids_ejemplos});
});

router.get('/notes/edit/:id', isAuthenticated , async (req,res)=>{
    const card = await Card.findById(req.params.id).lean();
    const p_label = await Label.find({'id_ejemplo': req.params.id,
    'id_user': req.user.id}).lean();
    const label= p_label[0];
    res.render('notes/edit-notes',{card,label});
});

router.post('/notes/edit-notes/:id', isAuthenticated , async (req,res)=>{
    const {robo, homicidio, secuestro, violencia, d_sexual, d_organizada, narcotrafico, suicidio, accidente, ninguno, representacion_grafica} = req.body;
    TF_category=(clase)=>{
        if(clase){
            return true;
        }else{
            return false;
        }
    }
    label = await Label.findOneAndUpdate({'id_ejemplo': req.params.id,
    'id_user': req.user.id},{
        'robo': TF_category(robo),
        'homicidio': TF_category(homicidio),
        'secuestro': TF_category(secuestro),
        'violencia': TF_category(violencia),
        'd_sexual': TF_category(d_sexual),
        'd_organizada': TF_category(d_organizada),
        'narcotrafico': TF_category(narcotrafico),
        'suicidio': TF_category(suicidio),
        'accidente': TF_category(accidente),
        'ninguno': TF_category(ninguno),
        'representacion_grafica': TF_category(representacion_grafica)
    },{new: true, upsert: true})
    req.flash('success_msg','Label added successfully');
    res.redirect('/notes');
});


module.exports = router;