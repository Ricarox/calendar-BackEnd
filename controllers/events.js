const { response } = require('express');
const Event = require('../models/Event');




const getEvents = async (req, res = response) => {


    const events = await Event.find().populate('user', 'name')

    res.json({
        ok: true,
        events
    })
}

const createEvent = async (req, res = response) => {

    const event = new Event(req.body)

    try {

        event.user = req.uid

        const eventDB = await event.save();

        res.json({
            ok: true,
            event: eventDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Event'
        });
    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'not exist event'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.json({
            ok: true,
            event: updatedEvent
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error update event'
        })

    }
}

const deleteEvent = async(req, res = response) => {

    
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'not exist event'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized'
            });
        }


        await Event.findByIdAndDelete( eventId );

        res.json({
            ok: true,
            msg: 'Delete complete'
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Delete event'
        })

    }
}













module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}

