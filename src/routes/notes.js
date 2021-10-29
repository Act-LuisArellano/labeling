const express = require('express');
const router = express.Router();
const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { ddbClient } = require("../libs/ddbClient.js");
const Note = require('../models/Note');
const Asignation = require('../models/Asignation');
const Card = require('../models/Card');
const Label = require('../models/Label');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/:page', isAuthenticated , async (req, res)=>{
    const asignation = await Asignation.findById(req.user.asignation);
    // const cards = await Card.find({_id:{$in:asignation.ids_ejemplo.split(',')}}).lean();
    // console.log(cards);
    const p_cards = await Card.paginate({_id:{$in:asignation.ids_ejemplo.split(',')}}, {limit:12,lean:true,page: req.params.page});
    const cards = p_cards.docs;
    // console.log(p_cards);
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
    num_page=p_cards.page;
    res.render('notes/all-notes', {cards,ids_ejemplos,num_page});
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
    // ---------------------AWS SAVE LABEL------------------------------

    const hoy = new Date();
    hoy.setTime(hoy.getTime());

    const label_params = {
    TableName: "labels",
    Item: {
        _id: { S: label._id.toString() },
        id_ejemplo: { S: label.id_ejemplo },
        id_user: { S: label.id_user },
        accidente: {BOOL: label.accidente},
        d_organizada: {BOOL: label.d_organizada},
        d_sexual: {BOOL: label.d_sexual},
        homicidio: {BOOL: label.homicidio},
        narcotrafico: {BOOL: label.narcotrafico},
        ninguno: {BOOL: label.ninguno},
        representacion_grafica: {BOOL: label.representacion_grafica},
        robo: {BOOL: label.robo},
        secuestro: {BOOL: label.secuestro},
        suicidio: {BOOL: label.suicidio},
        violencia: {BOOL: label.violencia},
        date: {S : hoy.toISOString()},
    },
    };
    const run = async () => {
        try {
            const data = await ddbClient.send(new PutItemCommand(label_params)); 
            return data;
        } catch (err) {
            console.error(err);
        }
    };
    run();
    // ----------------------------------------------------------------
    req.flash('success_msg','Label added successfully');
    res.redirect('/notes/'+num_page);
});


module.exports = router;