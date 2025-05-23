import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'At least one contact info required' });
  }

  try {
    // Find existing contacts
    const existingContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    if (existingContacts.length === 0) {
      // Create new primary contact
      const newContact = await prisma.contact.create({
        data: {
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkPrecedence: 'primary'
        }
      });

      return res.json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email].filter(Boolean),
          phoneNumbers: [newContact.phoneNumber].filter(Boolean),
          secondaryContactIds: []
        }
      });
    }

    // Find primary contact (oldest or linked to primary)
    let primaryContact = existingContacts.find(c => c.linkPrecedence === 'primary');
    if (!primaryContact) {
      primaryContact = await prisma.contact.findFirst({
        where: { id: existingContacts[0].linkedId! }
      });
    }

    // Check if new info needs to be added
    const hasNewEmail = email && !existingContacts.some(c => c.email === email);
    const hasNewPhone = phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber);

    if (hasNewEmail || hasNewPhone) {
      await prisma.contact.create({
        data: {
          email: hasNewEmail ? email : null,
          phoneNumber: hasNewPhone ? phoneNumber : null,
          linkedId: primaryContact!.id,
          linkPrecedence: 'secondary'
        }
      });
    }

    // Get all linked contacts
    const allContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: primaryContact!.id },
          { linkedId: primaryContact!.id }
        ]
      }
    });

    // Prepare response
    const emails = Array.from(new Set(allContacts.map(c => c.email).filter(Boolean)));
    const phoneNumbers = Array.from(new Set(allContacts.map(c => c.phoneNumber).filter(Boolean)));
    const secondaryIds = allContacts
      .filter(c => c.linkPrecedence === 'secondary')
      .map(c => c.id);

    res.json({
      contact: {
        primaryContatctId: primaryContact!.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryIds
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;