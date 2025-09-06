// tests/gateway.controller.test.ts
import request from "supertest";
import app from "../../../src/app";
import * as gatewayService from "../../../src/services/gateway.service";
import * as deviceService from "../../../src/services/device.service";

jest.mock("../../../src/services/gateway.service");
jest.mock("../../../src/services/device.service");

describe("Gateway Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockGateways = [
    {
      id: "73060480-9dc4-4822-9fc4-f3d262bd4890",
      serial_number: "TG001",
      name: "Updated Test Gateway",
      ipv4_address: "192.168.1.100",
      status: "ACTIVE",
      location: "Updated Location",
      created_at: "2025-09-05T15:58:32.612Z",
      updated_at: "2025-09-05T16:02:36.099Z",
      tenant_id: "661059d1-b481-41f1-ba19-88a8594d75c5",
      devices: [
        {
          id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
          uid: "789789789",
          vendor: "Test Vendor",
          status: "ONLINE",
          created_at: "2025-09-05T16:02:29.187Z",
          last_seen: null,
          gateway_id: "73060480-9dc4-4822-9fc4-f3d262bd4890",
          device_type_id: 1,
          device_type: {
            id: 1,
            name: "New Name",
            description: "New Description",
          },
        },
      ],
      tenant: {
        id: "661059d1-b481-41f1-ba19-88a8594d75c5",
        name: "string",
        contact_email: "user@example.com",
        created_at: "2025-09-05T14:19:47.119Z",
      },
    },
  ];
  const mockGateway = mockGateways[0];

  // ============================================================================
  // POST /api/gateways - Create Gateway Tests
  // ============================================================================
  
  it("POST /api/gateways should create a new gateway", async () => {
    (gatewayService.createGateway as jest.Mock).mockResolvedValue(mockGateway);
    const response = await request(app).post("/api/gateways").send({
      name: "Test Gateway",
      serial_number: "TG001",
      ipv4_address: "192.168.1.100",
      status: "ACTIVE",
      tenant_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockGateway);
  });

  // ============================================================================
  // POST /api/gateways - Invalid Input Tests
  // ============================================================================
  
  it("POST /api/gateways should create a new gateway", async () => {
    (gatewayService.createGateway as jest.Mock).mockResolvedValue(mockGateway);
    const response = await request(app).post("/api/gateways").send({
      name: "Test Gateway",
      serial_number: "TG001",
      ipv4_address: "192.168.1",
      status: "ACTIVE",
      tenant_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    });
    expect(response.status).toBe(400);
  });

  // ============================================================================
  // GET /api/gateways/:id - Get Gateway by ID Tests
  // ============================================================================
  
  it("GET /api/gateways/:id should return a gateway by ID", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(mockGateway);
    const response = await request(app).get(`/api/gateways/${mockGateway!.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGateway);
  });

  // ============================================================================
  // GET /api/gateways - List All Gateways Tests
  // ============================================================================
  
  it("GET /api/gateways should return a list of gateways", async () => {
    (gatewayService.listGateways as jest.Mock).mockResolvedValue(mockGateways);
    const response = await request(app).get("/api/gateways");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGateways);
  });

  // ============================================================================
  // DELETE /api/gateways/:id - Delete Gateway Tests
  // ============================================================================
  
  it("DELETE /api/gateways/:id should delete a gateway by ID", async () => {
    const response = await request(app).delete(
      `/api/gateways/${mockGateway!.id}`
    );
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  // ============================================================================
  // DELETE /api/gateways/:id - Gateway Not Found Tests
  // ============================================================================
  
  it("DELETE /api/gateways/:id should return 404 if gateway not found", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(null);
    const response = await request(app).delete(
      `/api/gateways/${mockGateway!.id}`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Gateway not found" });
  });

  // ============================================================================
  // PATCH /api/gateways/:id - Update Gateway Tests
  // ============================================================================
  
  it("PATCH /api/gateways/:id should update a gateway by ID", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(mockGateway);
    (gatewayService.updateGateway as jest.Mock).mockResolvedValue(mockGateway);
    const response = await request(app)
      .patch(`/api/gateways/${mockGateway!.id}`)
      .send({
        name: "Updated Test Gateway",
        ipv4_address: "192.168.1.100",
        status: "ACTIVE",
        location: "Updated Location",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGateway);
  });

  // ============================================================================
  // PATCH /api/gateways/:id - Update Gateway Not Found Tests
  // ============================================================================
  
  it("PATCH /api/gateways/:id should return 404 if gateway not found", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .patch(`/api/gateways/${mockGateway!.id}`)
      .send({
        name: "Updated Test Gateway",
        ipv4_address: "192.168.1.100",
        status: "ACTIVE",
        location: "Updated Location",
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Gateway not found" });
  });

  // ============================================================================
  // POST /api/gateways/:id/devices - Invalid Device Data Tests
  // ============================================================================
  
  it("POST /api/gateways/:id/devices should return 400 for invalid data", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(mockGateway);
    const response = await request(app)
      .post(`/api/gateways/${mockGateway!.id}/devices`)
      .send({
        name: "New Device",
        type: "sensor",
        status: "ACTIVE",
      });
    expect(response.status).toBe(400);
  });

  // ============================================================================
  // POST /api/gateways/:id/devices - Attach Device to Gateway Tests
  // ============================================================================
  
  it("POST /api/gateways/:id/devices should attach a device to a gateway", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(mockGateway);
    (deviceService.getDeviceById as jest.Mock).mockResolvedValue({
      id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
      uid: "789789789",
      vendor: "Test Vendor",
      status: "ONLINE",
      created_at: "2025-09-05T16:02:29.187Z",
      last_seen: null,
      gateway_id: null,
      device_type_id: 1,
    });
    (deviceService.attachDeviceToGateway as jest.Mock).mockResolvedValue({
      id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
      uid: "789789789",
      vendor: "Test Vendor",
      status: "ONLINE",
      created_at: "2025-09-05T16:02:29.187Z",
      last_seen: null,
      gateway_id: mockGateway!.id,
      device_type_id: 1,
    });
    const response = await request(app)
      .post(`/api/gateways/${mockGateway!.id}/devices`)
      .send({ deviceId: "5aa47e2d-6c82-44a3-8737-49ff42bb7253" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
      uid: "789789789",
      vendor: "Test Vendor",
      status: "ONLINE",
      created_at: "2025-09-05T16:02:29.187Z",
      last_seen: null,
      gateway_id: mockGateway!.id,
      device_type_id: 1,
    });
  });

  // ============================================================================
  // DELETE /api/gateways/:id/devices/:deviceId - Gateway Not Found Tests
  // ============================================================================
  
  it("DELETE /api/gateways/:id/devices/:deviceId should return 404 if gateway not found", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(null);
    const response = await request(app).delete(
      `/api/gateways/${
        mockGateway!.id
      }/devices/5aa47e2d-6c82-44a3-8737-49ff42bb7253`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Gateway not found" });
  });

  // ============================================================================
  // DELETE /api/gateways/:id/devices/:deviceId - Device Not Found Tests
  // ============================================================================
  
  it("DELETE /api/gateways/:id/devices/:deviceId should return 404 if device not found", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(mockGateway);
    (deviceService.getDeviceById as jest.Mock).mockResolvedValue(null);
    const response = await request(app).delete(
      `/api/gateways/${
        mockGateway!.id
      }/devices/5aa47e2d-6c82-44a3-8737-49ff42bb7253`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Device not found" });
  });

  // ============================================================================
  // DELETE /api/gateways/:id/devices/:deviceId - Detach Device Tests
  // ============================================================================
  
  it("DELETE /api/gateways/:id/devices/:deviceId should detach a device from a gateway", async () => {
    (gatewayService.getGatewayById as jest.Mock).mockResolvedValue(mockGateway);
    (deviceService.getDeviceById as jest.Mock).mockResolvedValue({
      id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
      uid: "789789789",
      vendor: "Test Vendor",
      status: "ONLINE",
      created_at: "2025-09-05T16:02:29.187Z",
      last_seen: null,
      gateway_id: mockGateway!.id,
      device_type_id: 1,
    });
    (deviceService.detachDeviceFromGateway as jest.Mock).mockResolvedValue({
      id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
      uid: "789789789",
      vendor: "Test Vendor",
      status: "ONLINE",
      created_at: "2025-09-05T16:02:29.187Z",
      last_seen: null,
      gateway_id: null,
      device_type_id: 1,
    });
    const response = await request(app).delete(
      `/api/gateways/${
        mockGateway!.id
      }/devices/5aa47e2d-6c82-44a3-8737-49ff42bb7253`
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "5aa47e2d-6c82-44a3-8737-49ff42bb7253",
      uid: "789789789",
      vendor: "Test Vendor",
      status: "ONLINE",
      created_at: "2025-09-05T16:02:29.187Z",
      last_seen: null,
      gateway_id: null,
      device_type_id: 1,
    });
  });
});
