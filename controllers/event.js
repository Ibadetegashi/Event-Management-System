const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createEvent = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const { availableSeats, ...otherData } = req.body;
    const imageUrl = req.cloudinaryUrl

    const event = await prisma.event.create({
      data: {
        availableSeats: parseInt(availableSeats),
        ...otherData,
        image: imageUrl,
      },
    });

    if (!event) {
      return res.status(400).json({ error: 'Could not create the event' });
    }

    return res.status(201).json(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const editEvent = async (req, res) => {
  try {

    const id = parseInt(req.params.id);
    const { availableSeats, ...otherData } = req.body;

    const findEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!findEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const image = req.file
      ? req.cloudinaryUrl
      : findEvent.image;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...otherData,
        image,
        availableSeats: parseInt(availableSeats),
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Cannot find an Event with this id' });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

// delete event also its participants only if those participants has only one event
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
      return res.status(404).json({ message: 'This event does not exist' });
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
      return res.status(400).json({ error: 'Failed to delete the event' });
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

    return res.status(200).json(deleteEvent);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    if (!events) {
      return res.status(404).json({ message: 'No Events Found' });
    }
    return res.status(200).json(events);
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
    return res.status(200).json(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

const getEventsByParticipant = async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);

    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      include: {
        events: true,
      }
    });
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    return res.status(200).json(participant.events);
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
              {
                startTime:
                  { gte: new Date(`${date}T00:00:00Z`) }
              },
              {
                startTime:
                  { lte: new Date(`${date}T23:59:59Z`) }
              },
            ],
          } : {}
        ]
      }
    })

    console.log(events);
    return res.status(200).json(events)
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
