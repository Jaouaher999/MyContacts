const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const tokenService = require("../services/tokenService");
const { register, login } = require("../services/authService");

jest.mock("bcryptjs");
jest.mock("../models/userModel");
jest.mock("../services/tokenService");

describe("authService", () => {
  const mockUserId = "user-id-123";
  const mockEmail = "test@example.com";
  const mockPassword = "Password123!";
  const mockHashed = "hashed-password";
  const mockToken = "jwt-token";

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("register", () => {
    test("throws 400 when email or password missing", async () => {
      await expect(register(undefined, mockPassword)).rejects.toMatchObject({
        status: 400,
      });
      await expect(register(mockEmail, undefined)).rejects.toMatchObject({
        status: 400,
      });
    });

    test("throws 409 when email already used", async () => {
      User.findOne.mockResolvedValue({ _id: "exists" });

      await expect(register(mockEmail, mockPassword)).rejects.toMatchObject({
        status: 409,
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
    });

    test("creates user and returns id, email, token", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(mockHashed);
      User.create.mockResolvedValue({ id: mockUserId, email: mockEmail });
      tokenService.generateToken.mockReturnValue(mockToken);

      const result = await register(mockEmail, mockPassword);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(User.create).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockHashed,
      });
      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUserId);

      expect(result).toEqual({
        _id: mockUserId,
        email: mockEmail,
        token: mockToken,
      });
    });
  });

  describe("login", () => {
    test("throws 400 when email or password missing", async () => {
      await expect(login(undefined, mockPassword)).rejects.toMatchObject({
        status: 400,
      });
      await expect(login(mockEmail, undefined)).rejects.toMatchObject({
        status: 400,
      });
    });

    test("throws 401 when user not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(login(mockEmail, mockPassword)).rejects.toMatchObject({
        status: 401,
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
    });

    test("throws 401 when password mismatch", async () => {
      User.findOne.mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        password: "stored-hash",
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(login(mockEmail, mockPassword)).rejects.toMatchObject({
        status: 401,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, "stored-hash");
    });

    test("returns id, email, token when credentials valid", async () => {
      User.findOne.mockResolvedValue({
        id: mockUserId,
        email: mockEmail,
        password: "stored-hash",
      });
      bcrypt.compare.mockResolvedValue(true);
      tokenService.generateToken.mockReturnValue(mockToken);

      const result = await login(mockEmail, mockPassword);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, "stored-hash");
      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual({
        _id: mockUserId,
        email: mockEmail,
        token: mockToken,
      });
    });
  });
});
