
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'support_tickets.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            const tickets = JSON.parse(fileData);

            const { userId } = req.query;
            if (userId) {
                const userTickets = tickets.filter(t => t.userId === userId || t.userId === parseInt(userId));
                return res.status(200).json(userTickets);
            }

            return res.status(200).json(tickets);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch tickets' });
        }
    } else if (req.method === 'POST') {
        try {
            const { userId, subject, description, category, orderId } = req.body;

            if (!subject || !description || !category) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            let tickets = [];
            try {
                const fileData = fs.readFileSync(dataFilePath, 'utf8');
                tickets = JSON.parse(fileData);
            } catch (e) {
                // File might be empty or not exist, start with empty array
                tickets = [];
            }

            const newTicket = {
                id: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                userId,
                subject,
                description,
                category,
                orderId: orderId || null,
                status: 'Open',
                createdAt: new Date().toISOString(),
                responses: []
            };

            tickets.push(newTicket);
            fs.writeFileSync(dataFilePath, JSON.stringify(tickets, null, 2));

            return res.status(201).json(newTicket);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create ticket' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
