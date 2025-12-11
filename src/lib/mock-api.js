import AxiosMockAdapter from "axios-mock-adapter";
import { apiClient } from "./axios.js";

// Initialize Mock Adapter
const mock = new AxiosMockAdapter(apiClient, { delayResponse: 600 });

// --- Mock Users ---
let mockUsers = [
  {
    id: "USR-001",
    email: "admin@erp.com",
    password: "admin",
    name: "John Doe",
    role: "Plant Admin",
    department: "Operations",
    avatar: "JD",
    permissions: ["admin", "write"],
    status: "Active",
    lastLogin: "2024-03-22T08:30:00Z",
  },
  {
    id: "USR-002",
    email: "user@erp.com",
    password: "user",
    name: "Sarah Smith",
    role: "Operator",
    department: "Shop Floor",
    avatar: "SS",
    permissions: ["read"],
    status: "Active",
    lastLogin: "2024-03-21T14:15:00Z",
  },
  {
    id: "USR-003",
    email: "finance@erp.com",
    password: "user",
    name: "Robert Cash",
    role: "Auditor",
    department: "Finance",
    avatar: "RC",
    permissions: ["read", "approve"],
    status: "Active",
    lastLogin: "2024-03-20T09:00:00Z",
  },
];

// --- User Management Endpoints ---
mock.onGet("/users").reply(200, mockUsers);

mock.onPost("/users").reply((config) => {
  const data = JSON.parse(config.data);
  const newUser = {
    ...data,
    id: `USR-${Math.floor(Math.random() * 10000)}`,
    avatar: data.name.charAt(0).toUpperCase(),
    status: "Active",
    lastLogin: null,
  };
  mockUsers.push(newUser);
  return [201, newUser];
});

mock.onPut(new RegExp("/users/*")).reply((config) => {
  const id = config.url.split("/").pop();
  const data = JSON.parse(config.data);
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index > -1) {
    mockUsers[index] = { ...mockUsers[index], ...data };
    return [200, mockUsers[index]];
  }
  return [404, { message: "User not found" }];
});

mock.onDelete(new RegExp("/users/*")).reply((config) => {
  const id = config.url.split("/").pop();
  mockUsers = mockUsers.filter((u) => u.id !== id);
  return [200, { success: true }];
});

// --- Auth Endpoints ---
mock.onPost("/auth/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (user) {
    const { password, ...userWithoutPass } = user;
    return [
      200,
      {
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
        user: userWithoutPass,
      },
    ];
  }
  return [401, { message: "Invalid credentials" }];
});

mock.onGet("/auth/me").reply((config) => {
  const authHeader = config.headers.Authorization;
  if (!authHeader) return [401, { message: "No token provided" }];
  const user = mockUsers[0];
  const { password, ...userWithoutPass } = user;
  return [200, userWithoutPass];
});

// --- Existing Data (Scaled Up for Virtualization) ---
let mockProducts = Array.from({ length: 1000 }).map((_, i) => ({
  id: `PROD-${1000 + i}`,
  sku: `SKU-${1000 + i}`,
  name: `Industrial Component ${String.fromCharCode(65 + (i % 26))}-${i}`,
  description: `High-grade industrial component suitable for heavy machinery sector ${i}. Includes standard warranty.`,
  category: ["Electronics", "Office", "Industrial", "Furniture"][i % 4],
  stock: Math.floor(Math.random() * 1000),
  price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
  location: `WH-${Math.floor(i / 100) + 1}-R${i % 100}`,
  status: Math.random() > 0.2 ? "Active" : "Discontinued",
  isFragile: Math.random() > 0.8,
  isBatchTracked: Math.random() > 0.6,
  lastUpdated: new Date().toISOString(),
}));

let mockOrders = [
  {
    id: "SO-2024-001",
    customer: "Acme Corp",
    date: "2024-03-10",
    status: "Confirmed",
    total: 1250.0,
    items: [
      {
        productId: "PROD-1001",
        productName: "Industrial Component B-1",
        quantity: 5,
        price: 250.0,
        total: 1250.0,
        serialNumbers: ["SN-1001-A", "SN-1001-B", "SN-1001-C", "SN-1001-D", "SN-1001-E"],
      },
    ],
  },
];

let mockQuotations = [
  {
    id: "QT-2024-882",
    customer: "Tesla Gigafactory",
    date: "2024-03-15",
    status: "Sent",
    total: 45000.0,
    validUntil: "2024-04-15",
    items: [{ productId: "PROD-1022", productName: "Robotic Arm Servo", quantity: 10, price: 4500.0, total: 45000.0 }],
  },
];

// --- Quality Data ---
let mockTests = [
  {
    id: "QC-001",
    serialNumber: "SN-1001-A",
    productName: "Industrial Component B-1",
    testDate: "2024-03-11T10:30:00Z",
    technician: "Jane Engineer",
    result: "Pass",
    metrics: { voltage: "24.1V", temperature: "45C", vibration: "0.02g" },
  },
];

let mockTestHistory = [
  {
    id: "T-101",
    serialNumber: "SN-1001-A",
    type: "Visual Inspection",
    date: "2024-03-10T09:00:00Z",
    result: "Pass",
    technician: "Operator A",
    notes: "No scratches observed.",
    stage: "Assembly",
  },
  {
    id: "T-102",
    serialNumber: "SN-1001-A",
    type: "Electrical Stress",
    date: "2024-03-11T14:20:00Z",
    result: "Fail",
    technician: "Engineer B",
    notes: "Voltage spike detected at 24V.",
    stage: "Quality Lab",
  },
];

let mockMachines = [
  { id: "M-01", name: "CNC Milling St-1", status: "Running", efficiency: 92, temperature: 65, activeJob: "JOB-4421" },
  { id: "M-02", name: "Robotic Welder A", status: "Idle", efficiency: 0, temperature: 22, activeJob: null },
  { id: "M-03", name: "Assembly Line 4", status: "Warning", efficiency: 45, temperature: 89, activeJob: "JOB-4425" },
  { id: "M-04", name: "Packaging Unit", status: "Running", efficiency: 98, temperature: 40, activeJob: "JOB-4420" },
];

// --- Approvals Data ---
let mockApprovals = [
  {
    id: "FILE-2024-089",
    subject: "Procurement of High-Grade Steel for Project X",
    initiator: "Robert Purchase",
    createdDate: "2024-03-20",
    status: "Pending",
    currentStage: "Finance Review",
    priority: "High",
  },
  {
    id: "FILE-2024-092",
    subject: "Engineering Change Request: Motor Mounting Specification",
    initiator: "Sarah Design",
    createdDate: "2024-03-22",
    status: "Pending",
    currentStage: "Technical Scrutiny",
    priority: "Medium",
  },
];

let mockNotings = {
  "FILE-2024-089": [
    {
      id: 1,
      user: "Robert Purchase",
      role: "Procurement Mgr",
      date: "2024-03-20 09:00",
      text: "Initiated file for approval. Budget code A-992 validated. Vendor quotes attached.",
      action: "Initiated",
    },
    { id: 2, user: "System", role: "Workflow", date: "2024-03-20 09:01", text: "File forwarded to Technical Review.", action: "Forward" },
    {
      id: 3,
      user: "David Tech",
      role: "Technical Lead",
      date: "2024-03-21 14:30",
      text: "Specs verified. The molybdenum content meets standard ISO-9921. Recommended for financial concurrence.",
      action: "Recommended",
    },
  ],
  "FILE-2024-092": [
    {
      id: 1,
      user: "Sarah Design",
      role: "Lead Engineer",
      date: "2024-03-22 10:00",
      text: "Requesting change in mounting bolts from M10 to M12 based on stress analysis report.",
      action: "Initiated",
    },
  ],
};

// --- Scrutiny Data ---
let mockFCL = [
  {
    id: "FCL-1001",
    refId: "SHIP-992",
    description: "Inbound Batch: Raw Aluminum",
    type: "Material Inward",
    status: "Pending",
    parameters: [
      { name: "Certificate of Origin", checked: true },
      { name: "Radiation Check", checked: false },
      { name: "Weight Bridge Slip", checked: true },
    ],
  },
  {
    id: "FCL-1002",
    refId: "SHIP-995",
    description: "Outbound: Turbine Blades",
    type: "Final Dispatch",
    status: "Approved",
    parameters: [
      { name: "Packaging Integrity", checked: true },
      { name: "Rust Protection", checked: true },
      { name: "Customs Seal", checked: true },
    ],
  },
];

let mockFCM = [
  {
    id: "FCM-552",
    refId: "ECR-221",
    description: "Change cooling fluid type",
    impact: "High",
    status: "Under Review",
    department: "Maintenance",
  },
  { id: "FCM-553", refId: "ECR-224", description: "Update PLC firmware v2.1", impact: "Low", status: "Approved", department: "Automation" },
];

// --- Dashboard Data ---
const salesTrendData = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 2000, orders: 120 },
  { month: "Apr", revenue: 2780, orders: 190 },
  { month: "May", revenue: 1890, orders: 110 },
  { month: "Jun", revenue: 2390, orders: 160 },
  { month: "Jul", revenue: 3490, orders: 210 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Office", value: 300 },
  { name: "Industrial", value: 300 },
  { name: "Furniture", value: 200 },
];

// --- Route Handlers ---

// Dashboard
mock.onGet("/dashboard/stats").reply(() => {
  const totalValue = mockProducts.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStock = mockProducts.filter((p) => p.stock < 50).length;
  const activeItems = mockProducts.filter((p) => p.status === "Active").length;

  return [
    200,
    {
      totalInventoryValue: totalValue,
      lowStockCount: lowStock,
      activeItemCount: activeItems,
      pendingOrders: mockOrders.length,
    },
  ];
});

mock.onGet("/dashboard/sales-trend").reply(200, salesTrendData);
mock.onGet("/dashboard/category-dist").reply(200, categoryData);

// Products
mock.onGet("/products").reply(() => [200, mockProducts]);
mock.onPost("/products").reply((config) => {
  const data = JSON.parse(config.data);
  const newProduct = { ...data, id: `PROD-${Math.floor(Math.random() * 100000)}`, lastUpdated: new Date().toISOString() };
  mockProducts = [newProduct, ...mockProducts];
  return [201, newProduct];
});
mock.onPost("/products/bulk").reply((config) => {
  const items = JSON.parse(config.data);
  const newItems = items.map((item) => ({
    ...item,
    id: `PROD-${Math.floor(Math.random() * 100000)}`,
    lastUpdated: new Date().toISOString(),
    category: item.category || "Industrial",
    status: item.status || "Active",
    isFragile: item.isFragile || false,
    stock: Number(item.stock) || 0,
    price: Number(item.price) || 0,
  }));
  mockProducts = [...newItems, ...mockProducts];
  return [200, { imported: newItems.length }];
});
mock.onGet(new RegExp("/products/*")).reply((config) => {
  const id = config.url.split("/").pop();
  const product = mockProducts.find((p) => p.id === id);
  if (product) return [200, product];
  return [404, { message: "Product not found" }];
});
mock.onPut(new RegExp("/products/*")).reply((config) => {
  const urlParts = config.url?.split("/");
  const id = urlParts ? urlParts[urlParts.length - 1] : "";
  const data = JSON.parse(config.data);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index > -1) {
    mockProducts[index] = { ...mockProducts[index], ...data, lastUpdated: new Date().toISOString() };
    return [200, mockProducts[index]];
  }
  return [404, { message: "Product not found" }];
});
mock.onDelete(new RegExp("/products/*")).reply((config) => {
  const urlParts = config.url?.split("/");
  const id = urlParts ? urlParts[urlParts.length - 1] : "";
  mockProducts = mockProducts.filter((p) => p.id !== id);
  return [200, { success: true }];
});

// Sales Orders
mock.onGet("/sales").reply(() => [200, mockOrders]);
mock.onGet(new RegExp("/sales/*")).reply((config) => {
  const id = config.url.split("/").pop();
  const order = mockOrders.find((o) => o.id === id);
  if (order) return [200, order];
  return [404, { message: "Order not found" }];
});
mock.onPost("/sales").reply((config) => {
  const data = JSON.parse(config.data);
  const newOrder = { ...data, id: `SO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}` };
  mockOrders = [newOrder, ...mockOrders];
  return [201, newOrder];
});

// Quotations
mock.onGet("/quotations").reply(() => [200, mockQuotations]);
mock.onPost("/quotations").reply((config) => {
  const data = JSON.parse(config.data);
  const newQuote = { ...data, id: `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}` };
  mockQuotations = [newQuote, ...mockQuotations];
  return [201, newQuote];
});

// Quality Control
mock.onGet("/quality").reply(() => [200, mockTests]);

// Get History for a specific Serial Number
mock.onGet(new RegExp("/quality/history/*")).reply((config) => {
  const urlParts = config.url.split("/");
  const sn = urlParts[urlParts.length - 1];
  const history = mockTestHistory.filter((t) => t.serialNumber === sn);
  return [200, history];
});

// Execute a Test
mock.onPost("/quality/test").reply((config) => {
  const data = JSON.parse(config.data);
  const newTest = {
    id: `T-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString(),
    ...data,
  };
  mockTestHistory.push(newTest);

  // Update dashboard list as well
  mockTests.unshift({
    id: `QC-${Math.floor(Math.random() * 10000)}`,
    serialNumber: newTest.serialNumber,
    productName: data.productName || "Component",
    testDate: newTest.date,
    result: newTest.result,
    technician: newTest.technician,
    metrics: {},
  });

  return [200, newTest];
});

// Generate Note / NCR
mock.onPost("/quality/generate-note").reply((config) => {
  const { serialNumber, type, content, result, stage } = JSON.parse(config.data);

  // If Fail, create NCR in Approvals
  if (result === "Fail") {
    const newFile = {
      id: `NCR-${Math.floor(Math.random() * 10000)}`,
      subject: `NCR: ${type} Failure - ${serialNumber}`,
      initiator: "Quality System",
      createdDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      currentStage: "Quality Scrutiny",
      priority: "High",
    };
    mockApprovals.push(newFile);

    // Add initial automated noting
    mockNotings[newFile.id] = [
      {
        id: 1,
        user: "System",
        role: "Automated",
        date: new Date().toLocaleString(),
        text: `Non-Conformance Report generated automatically.\nReason: ${content}\nStage: ${stage}`,
        action: "Created",
      },
    ];

    return [200, { message: "NCR Created", fileId: newFile.id }];
  }

  // If Pass, generate certificate (simulated)
  return [200, { message: "Quality Certificate Generated" }];
});

// Machines / IoT
mock.onGet("/machines").reply(() => [200, mockMachines]);

// Workflow / Approvals
mock.onGet("/workflow/approvals").reply(() => [200, mockApprovals]);
mock.onGet(new RegExp("/workflow/notings/*")).reply((config) => {
  const urlParts = config.url?.split("/");
  const id = urlParts ? urlParts[urlParts.length - 1] : "";
  return [200, mockNotings[id] || []];
});
mock.onPost("/workflow/notings").reply((config) => {
  const { fileId, text, action } = JSON.parse(config.data);
  const newNote = {
    id: Math.floor(Math.random() * 10000),
    user: "John Doe",
    role: "Plant Admin",
    date: new Date().toLocaleString(),
    text,
    action,
  };
  if (!mockNotings[fileId]) mockNotings[fileId] = [];
  mockNotings[fileId].push(newNote);
  return [200, newNote];
});

// Scrutiny
mock.onGet("/scrutiny/fcl").reply(() => [200, mockFCL]);
mock.onGet("/scrutiny/fcm").reply(() => [200, mockFCM]);

export default mock;
