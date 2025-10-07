const Contact = require("../models/contactModel");
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../services/contactService");

jest.mock("../models/contactModel");

describe("contactService", () => {
  const userId = "user-1";
  const contactId = "contact-1";
  const data = { firstName: "John", lastName: "Doe", phone: "+123456789" };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("createContact", () => {
    test("throws 400 when phone missing", async () => {
      const invalid = { firstName: "John" };
      await expect(createContact(userId, invalid)).rejects.toMatchObject({
        status: 400,
      });
    });

    test("throws 409 when phone already used", async () => {
      Contact.findOne.mockResolvedValue({ _id: "existing" });

      await expect(createContact(userId, data)).rejects.toMatchObject({
        status: 409,
      });

      expect(Contact.findOne).toHaveBeenCalledWith({ phone: data.phone });
    });

    test("creates and returns normalized contact", async () => {
      Contact.findOne.mockResolvedValue(null);
      Contact.create.mockResolvedValue({ id: contactId, ...data, userId });

      const result = await createContact(userId, data);

      expect(Contact.findOne).toHaveBeenCalledWith({ phone: data.phone });
      expect(Contact.create).toHaveBeenCalledWith({
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      expect(result).toEqual({
        _id: contactId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
    });
  });

  describe("getContacts", () => {
    test("returns contacts by userId", async () => {
      const docs = [{ id: "c1" }, { id: "c2" }];
      Contact.find.mockResolvedValue(docs);

      const result = await getContacts(userId);

      expect(Contact.find).toHaveBeenCalledWith({ userId });
      expect(result).toBe(docs);
    });
  });

  describe("getContactById", () => {
    test("throws 404 when not found", async () => {
      Contact.findOne.mockResolvedValue(null);

      await expect(getContactById(userId, contactId)).rejects.toMatchObject({
        status: 404,
      });

      expect(Contact.findOne).toHaveBeenCalledWith({ _id: contactId, userId });
    });

    test("returns doc when found", async () => {
      const doc = { id: contactId, ...data };
      Contact.findOne.mockResolvedValue(doc);

      const result = await getContactById(userId, contactId);

      expect(Contact.findOne).toHaveBeenCalledWith({ _id: contactId, userId });
      expect(result).toBe(doc);
    });
  });

  describe("updateContact", () => {
    test("throws 404 when not found", async () => {
      Contact.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        updateContact(userId, contactId, { firstName: "Jane" })
      ).rejects.toMatchObject({ status: 404 });

      expect(Contact.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: contactId, userId },
        { firstName: "Jane" },
        { new: true }
      );
    });

    test("returns updated doc", async () => {
      const updated = { id: contactId, firstName: "Jane" };
      Contact.findOneAndUpdate.mockResolvedValue(updated);

      const result = await updateContact(userId, contactId, {
        firstName: "Jane",
      });

      expect(Contact.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: contactId, userId },
        { firstName: "Jane" },
        { new: true }
      );
      expect(result).toBe(updated);
    });
  });

  describe("deleteContact", () => {
    test("throws 404 when not found", async () => {
      Contact.findOneAndDelete.mockResolvedValue(null);

      await expect(deleteContact(userId, contactId)).rejects.toMatchObject({
        status: 404,
      });

      expect(Contact.findOneAndDelete).toHaveBeenCalledWith({
        _id: contactId,
        userId,
      });
    });

    test("resolves when deleted", async () => {
      Contact.findOneAndDelete.mockResolvedValue({ id: contactId });

      await expect(deleteContact(userId, contactId)).resolves.toBeUndefined();

      expect(Contact.findOneAndDelete).toHaveBeenCalledWith({
        _id: contactId,
        userId,
      });
    });
  });
});
