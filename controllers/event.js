const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createEvent = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).send({error:'Image is required'});
    }

    const { availableSeats, ...otherData } = req.body;
    const imageUrl = req.cloudinaryUrl 
    console.log(req.cloudinaryUrl);

    const event = await prisma.event.create({
      data: {
        image: imageUrl,
        availableSeats: parseInt(availableSeats),
        ...otherData,
      },
      include: {
        participants: true,
      },
    });
    if (!event) {
      return res.status(400).send({ error: 'Could not create the event' });
    }

    return res.status(201).send(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const editEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const findEvent = await prisma.event.findUnique({
      where: { id },
    });
    if (!findEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const {
      availableSeats, ...otherData } = req.body;

    const image = req.file
      ? req.cloudinaryUrl
      : findEvent.image;

    const event = await prisma.event.update({
      where: { id },
      include: { participants: true },
      data: {
        ...otherData,
        image,
        availableSeats: parseInt(availableSeats),
      },
    });

    if (!event) {
      return res
        .status(400)
        .send({ error: 'Cannot find an Event with this id' });
    }
    return res.status(200).send(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

// delete event also its participant only if those participant has only one event
const deleteEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const findEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });
    if (!findEvent) {
      return res.status(404).send({ message: 'This event does not exist' });
    }

    const deleteEvent = await prisma.event.delete({
      where: { id: findEvent.id },
      include: {
        participants: {
          include: {
            events: true,
          },
        },
      },
    });
    if (!deleteEvent) {
      return res.status(400).send({ error: 'Failed to delete the event' });
    }
    for (const participant of deleteEvent.participants) {
      console.log(participant);
      if (participant.events?.length === 1) {
        await prisma.participant.delete({
          where: {
            id: participant.id,
          },
        });
      }
    }

    const otherEvents = await prisma.event.findMany({
      include: {
        participants: true,
      },
    });
    return res.status(200).send({ deleteEvent, otherEvents });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        participants: true,
      },
    });
    if (!events) {
      return res.status(404).send({ message: 'No Events Found' });
    }
    return res.status(200).send(events);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getEventById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: true,
      },
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).send(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getEventsByParticipant = async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);

    const events = await prisma.event.findMany({
      where: {
        participants: {
          some: {
            id: participantId,
          },
        },
      },
    });
    if (!events || events.length === 0) {
      return res
        .status(404)
        .send({ message: 'Participant not found' });
    }

    return res.status(200).send(events);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const searchEvent = async (req, res) => {
  try {
    const { name, location, date } = req.query
    const events = await prisma.event.findMany({
      where: {
        AND: [
          name ? {
            name: { contains: name },
          } : {},

          location ? {
            location: { contains: location },
          } : {},

          date ? {
            AND: [
              { startTime: { gte: new Date(`${date}T00:00:00Z`) } },
              { startTime: { lte: new Date(`${date}T23:59:59Z`) } },
            ],
          } : {}
        ]
      }
    })
    console.log(events);
    return res.status(200).send(events)
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  createEvent,
  editEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventsByParticipant,
  searchEvent
};
