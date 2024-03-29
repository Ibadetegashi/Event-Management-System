const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const sendEmailConfirm = require("../utils/sendEmailConfirm");
const sendEmailRemoved = require("../utils/sendEmailRemoved");

const participantRegister = async (req, res) => {
  try {
    const { eventId, ...participantData } = req.body;

    const eventToParticipate = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!eventToParticipate) {
      return res.status(404).json({ message: "Event not found" });
    }
    // check if registration is closed
    if (eventToParticipate.registrationDeadline <= Date.now()) {
      return res.status(403).json("Registration is closed");
    }
    // Checking if the user already registered for this event
    const existingUser = eventToParticipate.participants.find(
      (user) => user.email === participantData.email,
    );

    if (existingUser) {
      return res.status(409).json({ message: "You are already registered" });
    }

    // check for available seats
    if (eventToParticipate.availableSeats === 0) {
      return res.status(400).json({ message: "No more spots available for this event" });
    }
    // check if participant with this email exists in participant table
    const participantExists = await prisma.participant.findUnique({
      where: { email: participantData.email },
    });

    let participant;
    if (participantExists) {
      // if email exists update that participant with new event
      participant = await prisma.participant.update({
        where: { id: participantExists.id },
        data: { events: { connect: { id: eventId } } },
      });
      // else create new one
    } else {
      participant = await prisma.participant.create({
        data: {
          ...participantData,
          events: {
            connect: {
              id: eventId,
            },
          },
        },
      });
    }

    if (!participant) {
      return res.status(409).json({ message: "Failed to register participant" });
    }

    // decrease the seats by one
    const eventToParticipateUpdated = await prisma.event.update({
      where: { id: eventId },
      data: {
        availableSeats: --eventToParticipate.availableSeats,
      },
    });

    sendEmailConfirm(participant, eventToParticipate);

    return res.status(201).json({ participant, eventToParticipateUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// GET all participants from all events
const getAllParticipants = async (req, res) => {
  try {
    const participants = await prisma.participant.findMany();

    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: "There are no registered participants" });
    }

    return res.status(200).json(participants);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

//get paprticipant with his events
const getParticipantById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        events: true,
      },
    });
    if (!participant) {
      return res.status(404).json({ message: "The participant was not found" });
    }
    return res.status(200).json(participant);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const getParticipantsByEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const findEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: true,
      }
    });

    if (!findEvent) {
      return res.status(404).json({ message: "This event does not exist." });
    }

    if (!findEvent.participants || findEvent.participants.length === 0) {
      return res.status(404).json({ message: "No one is registered for this event " });
    }

    return res.status(200).json(findEvent.participants);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const editParticipant = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const findParticipant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!findParticipant) {
      return res.status(404).json({ message: "The participant does not exists" });
    }

    const updateParticipant = await prisma.participant.update({
      where: { id },
      data: req.body,
    });

    if (!updateParticipant) {
      return res.status(400).json({ error: "Failed to update this participant" });
    }
    return res.status(200).json(updateParticipant);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};


const deleteParticipant = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const findParticipant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!findParticipant) {
      return res.status(404).json({ message: "Participant not found!" });
    }

    const deleteParticipant = await prisma.participant.delete({
      where: { id },
    });

    if (!deleteParticipant) {
      return res.status(409).json({ error: "Failed to delete the participant" });
    }

    return res.status(200).json(deleteParticipant);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const removeParticipantFromSpecificEvent = async (req, res) => {
  try {
    const participantId = parseInt(req.params.participantId);
    const eventId = parseInt(req.body.eventId);
    //check if event exists
    const findEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });
    if (!findEvent) {
      return res.status(404).json({ message: "The Event not found." });
    }
    //check if participant exists in this event
    const existParticipant = findEvent.participants
      .find(participant => participant.id === participantId)

    if (!existParticipant) {
      return res.status(404).json({ message: "The Participant not found" });
    }

    //disconnect that participant from that event
    const updateEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: { disconnect: { id: participantId } },
        availableSeats: {
          increment: 1
        }
      },
      include: {
        participants: true,
      },
    });
    //delete that participant if it has no other events (if so, after disconnect has 0 events)
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        events: true
      }
    });


    console.log('participant after disconnect', participant);
    sendEmailRemoved(participant, findEvent)

    if (participant.events.length === 0) {
      await prisma.participant.delete({
        where: { id: participantId }
      })
    }

    return res.status(200).json(updateEvent);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  participantRegister,
  getAllParticipants,
  getParticipantById,
  getParticipantsByEvent,
  editParticipant,
  deleteParticipant,
  removeParticipantFromSpecificEvent,
};
