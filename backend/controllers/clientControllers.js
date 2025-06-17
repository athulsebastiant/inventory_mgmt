import Client from "../models/client.js";

export const createClient = async (req, res) => {
  try {
    console.log(req.body);
    const client = new Client(req.body);
    await client.save();
    res
      .status(201)
      .json({ success: true, message: "Client created", client: client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ success: true, message: "Client Detail Updated", client });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClientCount = async (req, res) => {
  try {
    const count = await Client.countDocuments(); // or .estimatedDocumentCount() if approximation is fine
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
